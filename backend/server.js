require("dotenv").config();


const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db");
const Groq = require("groq-sdk");
const admin = require("firebase-admin");
const cron = require("node-cron");

console.log("SERVER VERSION FINAL");


/* ================= APP ================= */

const app = express();
app.use(express.json());
app.use(cors());

/* ================= DB TEST ================= */

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Database Connected Successfully");
  } catch (err) {
    console.log("❌ DB Error:", err);
  }
})();

/* ================= GROQ ================= */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


async function predictDelay(user_id, taskTitle) {

  try {

    const [history] = await db.query(`
      SELECT t.title, b.completed_on_time
      FROM user_behavior b
      JOIN tasks t ON b.task_id = t.id
      WHERE b.user_id=?
      ORDER BY b.id DESC
      LIMIT 10
    `, [user_id]);

    if (history.length < 3) {
      return {
        willDelay: false,
        confidence: 0.3,
        reason: "Not enough data"
      };
    }

    const context = history.map(h =>
      `${h.title} - ${h.completed_on_time ? "on time" : "late"}`
    ).join("\n");

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
User history:
${context}

New task: ${taskTitle}

Predict delay.

Respond ONLY JSON:
{
 "willDelay": true or false,
 "confidence": number between 0 and 1,
 "reason": "short explanation"
}
`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.2
    });

    const text = response.choices[0].message.content.trim();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      return {
        willDelay: false,
        confidence: 0.5,
        reason: "Parse error"
      };
    }

    return result;

  } catch (err) {
    console.log("AI ERROR:", err);

    return {
      willDelay: false,
      confidence: 0.5,
      reason: "AI failed"
    };
  }
}


// ✅ CORRECT (TOP LEVEL ROUTE)

app.get("/ai-insights/:user_id", async (req, res) => {

  const { user_id } = req.params;

  try {

    const [tasks] = await db.query(
      "SELECT * FROM tasks WHERE user_id=?",
      [user_id]
    );

    let insights = [];

    for (let task of tasks) {

      const ai = await predictDelay(user_id, task.title);

      insights.push({
        id: task.id,
        title: task.title,
        priority: task.priority,
        willDelay: ai.willDelay,
        confidence: ai.confidence,
        reason: ai.reason
      });
    }

    res.json(insights);

  } catch (err) {
    console.log(err);
    res.status(500).json("Error fetching AI insights");
  }

});


app.post("/preferences", async (req, res) => {
  const { user_id, start_time, end_time, deadline_type, tasks_per_day } = req.body;

  try {
    await db.query(
      `INSERT INTO user_preferences (user_id, start_time, end_time, deadline_type, tasks_per_day)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       start_time=VALUES(start_time),
       end_time=VALUES(end_time),
       deadline_type=VALUES(deadline_type),
       tasks_per_day=VALUES(tasks_per_day)`,
      [user_id, start_time, end_time, deadline_type, tasks_per_day]
    );

    res.json("Preferences saved");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error saving preferences");
  }
});




app.get("/delay-history/:user_id", async (req, res) => {

  const { user_id } = req.params;

  const [data] = await db.query(`
    SELECT t.title, b.completed_on_time, b.delay_minutes
    FROM user_behavior b
    JOIN tasks t ON b.task_id = t.id
    WHERE b.user_id=?
    ORDER BY b.id DESC
  `, [user_id]);

  res.json(data);
});

/* ================= AI PRIORITY (FIXED) ================= */

app.post("/ai-priority", async (req, res) => {

  const { title, description, deadline } = req.body;

  try {

    const prompt = `
You are a smart task manager AI.

Decide task priority based on:
- Deadline urgency
- Importance
- Keywords like exam, project, urgent

Rules:
- High → urgent, near deadline
- Medium → normal tasks
- Low → flexible tasks

Respond ONLY in JSON:

{
  "priority": "High/Medium/Low",
  "reason": "short explanation"
}

Task:
Title: ${title}
Description: ${description}
Deadline: ${deadline}
`;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant", // ✅ WORKING MODEL
      temperature: 0.2               // ✅ STABLE OUTPUT
    });

    const text = response.choices[0].message.content;

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = {
        priority: "Medium",
        reason: text
      };
    }

    res.json(result);

  } catch (error) {
    console.log("AI ERROR:", error);
    res.status(500).json({ error: "AI failed" });
  }

});



/* ================= REGISTER ================= */

app.post("/register", async (req, res) => {

  const { name, email, password, role } = req.body;

  try {

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ INSERT USER (ONLY ONCE)
    const [result] = await db.query(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [name, email, hashedPassword, role]
    );

    // ✅ SEND USER DATA BACK
    res.json({
      message: "User Registered Successfully",
      user: {
        id: result.insertId,
        name,
        email
      }
    });

  } catch (error) {

    console.log(error);

    // 🔥 HANDLE DUPLICATE EMAIL
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json("Email already exists ❌");
    }

    res.status(500).json("Registration failed");
  }

});


/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const [result] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (result.length === 0)
      return res.status(404).json("User not found");

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json("Wrong password");

    res.json({
  message: "Login success",
  name: user.name,
  user_id: user.id   // 🔥 ADD THIS LINE
});

  } catch (error) {
    res.status(500).json("Login failed");
  }

});



/* ================= TASK APIs ================= */

app.post("/tasks", async (req, res) => {

  const { title, description, deadline, priority, reminder, user_id } = req.body;

  console.log("REQ BODY:", req.body); // 🔥 DEBUG

  try {

    if (!user_id) {
      return res.status(400).json("User ID missing");
    }

    await db.query(
      "INSERT INTO tasks (title, description, deadline, priority, reminder, status, user_id) VALUES (?, ?, ?, ?, ?, 'pending', ?)",
      [title, description, deadline, priority, reminder, user_id]
    );
    console.log("TASK INSERTED SUCCESSFULLY"); 

    res.json("Task added");

  } catch (err) {
    console.log("ADD TASK ERROR:", err);
    res.status(500).json("Error adding task");
  }

});

app.get("/tasks/:user_id", async (req, res) => {

  const { user_id } = req.params;

  try {
    const [result] = await db.query(
      "SELECT * FROM tasks WHERE user_id=? ORDER BY deadline ASC",
      [user_id]
    );

    res.json(result);

  } catch (err) {
    res.status(500).json(err);
  }

});

app.delete("/tasks/:id/:user_id", async (req, res) => {

  const { id, user_id } = req.params;

  try {
    await db.query(
      "DELETE FROM tasks WHERE id=? AND user_id=?",
      [id, user_id]
    );

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json(err);
  }

});


app.put("/tasks/:id", async (req, res) => {

  const { status, user_id } = req.body;

  try {

    const [taskResult] = await db.query(
      "SELECT * FROM tasks WHERE id=?",
      [req.params.id]
    );

    const task = taskResult[0];

    await db.query(
      "UPDATE tasks SET status=? WHERE id=?",
      [status, req.params.id]
    );

    // 🔥 TRACK ONLY WHEN COMPLETED
    if (status === "completed") {

      const deadline = new Date(task.deadline);
      const now = new Date();

      const delayMinutes = (now - deadline) / (1000 * 60);

      const onTime = delayMinutes <= 0;

      await db.query(
        "INSERT INTO user_behavior (user_id, task_id, completed_on_time, delay_minutes) VALUES (?,?,?,?)",
        [task.user_id, task.id, onTime, delayMinutes]
      );
    }

    res.json({ message: "Updated" });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

app.put("/tasks/update/:id", async (req, res) => {

  const { title, description, deadline, priority, reminder } = req.body;

  try {

    await db.query(
      `UPDATE tasks 
       SET title=?, description=?, deadline=?, priority=?, reminder=? 
       WHERE id=?`,
      [title, description, deadline, priority, reminder, req.params.id]
    );

    res.json({ message: "Task Updated" });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: "Update failed" });
  }

});

app.get("/notifications/:user_id", async (req, res) => {

  const { user_id } = req.params;

  try {

    const [tasks] = await db.query(
      "SELECT * FROM tasks WHERE user_id=?",
      [user_id]
    );

    /* ================= BEHAVIOR ================= */

    const [behavior] = await db.query(
      "SELECT * FROM user_behavior WHERE user_id=? ORDER BY id DESC LIMIT 10",
      [user_id]
    );

    let userType = "balanced";

    if (behavior.length > 0) {
      const lateCount = behavior.filter(b => !b.completed_on_time).length;

      if (lateCount >= 5) userType = "late";
      else if (lateCount <= 2) userType = "ontime";
    }

    /* ================= PREFERENCES ================= */

    const [pref] = await db.query(
      "SELECT * FROM user_preferences WHERE user_id=?",
      [user_id]
    );

    const userPref = pref[0];

    const now = new Date();
    let notifications = [];
    const aiCache = {};

    /* ================= LOOP ================= */

    for (let task of tasks) {

      const deadline = new Date(task.deadline);
      const diffMinutes = (deadline - now) / (1000 * 60);

      /* ================= SPAM ================= */

      if (task.last_notified) {
        const gap = (now - new Date(task.last_notified)) / (1000 * 60);
        if (gap < 5) continue;
      }

      /* ================= PRODUCTIVE TIME ================= */

      if (userPref) {
        const currentHour = now.getHours();
        const startHour = new Date(`1970-01-01T${userPref.start_time}`).getHours();
        const endHour = new Date(`1970-01-01T${userPref.end_time}`).getHours();

        if (currentHour < startHour || currentHour > endHour) continue;
      }

      /* ================= AI ================= */

      if (!aiCache[task.title]) {
        aiCache[task.title] = await predictDelay(user_id, task.title);
      }

      const ai = aiCache[task.title];

      const willDelay = ai.willDelay;
      const confidence = ai.confidence;

      let shouldNotify = false;

      /* ================= BASE OFFSET ================= */

      let baseOffset = 0;

      if (task.priority === "High") baseOffset = 1440;
      else if (task.priority === "Medium") baseOffset = 60;
      else baseOffset = 15;

      /* ================= FINAL DECISION ENGINE ================= */


// 🔹 STEP 2: USER PREFERENCE (FIRST PRIORITY)
/* ================= USER PREFERENCE (BEHAVIOR CORRECTION) ================= */

if (userPref) {

  if (userPref.deadline_type === "Delay until last moment") {
    // 🔥 PUSH USER → REMIND EARLY
    baseOffset *= 1.5;
  }

  else if (userPref.deadline_type === "Finish close to deadline") {
    // ⏰ NORMAL
    baseOffset *= 1.0;
  }

  else if (userPref.deadline_type === "Finish task early") {
    // 😌 USER IS GOOD → LESS PRESSURE
    baseOffset *= 0.8;
  }

}


// 🔹 STEP 3: BEHAVIOR ADJUSTMENT
if (userType === "late") {
  baseOffset *= 1.2;
}
else if (userType === "ontime") {
  baseOffset *= 0.8;
}


// 🔹 STEP 4: AI FINAL BOOST
if (willDelay && confidence > 0.7) {
  baseOffset *= 1.3;
}


// 🔹 STEP 5: TRIGGER WINDOW
if (diffMinutes <= baseOffset && diffMinutes > baseOffset - 2) {
  shouldNotify = true;
}

      /* ================= TRIGGER ================= */

      if (diffMinutes <= baseOffset && diffMinutes > baseOffset - 2) {
        shouldNotify = true;
      }

      /* ================= LOAD CONTROL ================= */

      if (userPref && userPref.tasks_per_day > 5) {
        if (task.priority === "Low") continue;
      }

      /* ================= SEND ================= */

      if (shouldNotify && task.status !== "completed") {

        if (task.priority === "Low" && task.notified_count >= 1) continue;
        if (task.priority === "Medium" && task.notified_count >= 2) continue;
        if (task.priority === "High" && task.notified_count >= 3) continue;

        notifications.push({
          id: task.id,
          message: `🔔 ${task.title} (Smart AI)`
        });

        await db.query(
          "UPDATE tasks SET notified_count = notified_count + 1, last_notified = NOW() WHERE id=?",
          [task.id]
        );
      }

      /* ================= OVERDUE ================= */

      if (diffMinutes < 0 && task.status !== "completed") {

        if (task.notified_count >= 1) continue;

        notifications.push({
          id: task.id,
          message: `⚠️ ${task.title} is overdue`
        });

        await db.query(
          "UPDATE tasks SET notified_count = notified_count + 1, last_notified = NOW() WHERE id=?",
          [task.id]
        );
      }

    }

    res.json(notifications);

  } catch (err) {
    console.log(err);
    res.status(500).json("Error fetching notifications");
  }

});


   

/* ================= AI CHAT ================= */

app.post("/ai-chat", async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const [tasks] = await db.query("SELECT * FROM tasks");

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = total - completed;

    const now = new Date();

    const overdue = tasks.filter(t =>
      new Date(t.deadline) < now && t.status !== "completed"
    ).length;

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    const systemPrompt = `
You are a friendly productivity buddy.

Completion: ${percentage}%
Pending: ${pending}
Overdue: ${overdue}

Talk casually. Only mention stats if user asks.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "llama-3.1-8b-instant"
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.log("AI CHAT ERROR:", error);
    res.status(500).json({ error: "Chat failed" });
  }

});



/* ================= AI FEEDBACK ================= */

app.get("/ai-feedback", async (req, res) => {

  try {

    const [tasks] = await db.query("SELECT * FROM tasks");

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;

    const prompt = `User completed ${completed}/${total}. Give motivation.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant"
    });

    res.json({
      feedback: completion.choices[0].message.content
    });

  } catch (error) {
    res.json({ feedback: "Keep going 💪" });
  }

});



/* ================= AI SCORE ================= */

app.get("/ai-score", async (req, res) => {

  try {

    const [tasks] = await db.query("SELECT * FROM tasks");

    const total = tasks.length;
    console.log("TRACKING BEHAVIOR FOR TASK:", task.id); 
    const completed = tasks.filter(t => t.status === "completed").length;

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    res.json({
      result: `Your productivity score is ${percentage}%`
    });

  } catch (error) {
    res.json({ result: "Unable to calculate score" });
  }

});

app.get("/profile/:user_id", async (req, res) => {

  const { user_id } = req.params;

  try {

    const [user] = await db.query(
      "SELECT name, email, profile_pic FROM users WHERE id=?",
      [user_id]
    );

    if (user.length === 0) {
      return res.status(404).json("User not found");
    }

    const [tasks] = await db.query(
      "SELECT * FROM tasks WHERE user_id=?",
      [user_id]
    );

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const productivity = total ? Math.round((completed / total) * 100) : 0;

    let onTime = 0;
    let late = 0;
    let avgDelay = 0;

    let behavior = [];

    try {
      const [b] = await db.query(
        "SELECT * FROM user_behavior WHERE user_id=?",
        [user_id]
      );
      behavior = b;
    } catch {
      behavior = [];
    }

    if (behavior.length > 0) {
      onTime = behavior.filter(b => b.completed_on_time).length;
      late = behavior.length - onTime;

      const totalDelay = behavior.reduce((sum, b) => sum + b.delay_minutes, 0);
      avgDelay = Math.round(totalDelay / behavior.length);
    }

    let label = "Balanced";

    if (late > onTime) label = "Needs Improvement";
    if (onTime > late + 3) label = "Highly Productive";

    res.json({
      name: user[0].name,
      email: user[0].email,
      profile_pic: user[0].profile_pic,
      total,
      completed,
      productivity,
      onTime,
      late,
      avgDelay,
      label
    });

  } catch (err) {
    console.log("PROFILE ERROR:", err); // 🔥 IMPORTANT
    res.status(500).json("Profile error");
  }

});

app.put("/profile/:user_id", async (req, res) => {

  const { user_id } = req.params;
  const { name, profile_pic } = req.body;

  try {

    await db.query(
      "UPDATE users SET name=?, profile_pic=? WHERE id=?",
      [name, profile_pic, user_id]
    );

    res.json("Updated");

  } catch (err) {
    res.status(500).json(err);
  }

});


/* ================= SERVER ================= */

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});