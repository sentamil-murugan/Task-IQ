import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditTask() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");

  /* ================= LOAD TASK ================= */

  useEffect(() => {

    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/tasks/${id}`);

        const task = res.data;

        setTitle(task.title);
        setDescription(task.description);

        // ✅ Convert DB format → input format
        const formatted = task.deadline
          ?.replace(" ", "T")
          ?.slice(0, 16);

        setDeadline(formatted || "");
        setPriority(task.priority);

      } catch (error) {
        console.log("FETCH ERROR:", error);
        alert("Error loading task");
      }
    };

    fetchTask();

  }, [id]);

  /* ================= FORMAT ================= */

  const formatDeadline = (value) => {
    if (!value) return "";
    return value.replace("T", " ") + ":00";
  };

  /* ================= UPDATE ================= */

  const updateTask = async () => {

    try {

      const formattedDeadline = formatDeadline(deadline);

      await axios.put(
        `http://localhost:5000/tasks/${id}`,
        {
          title,
          description,
          deadline: formattedDeadline,
          priority,
          status: "pending" // optional
        }
      );

      alert("Task Updated Successfully");
      navigate("/dashboard");

    } catch (error) {
      console.log("UPDATE ERROR:", error);
      alert("Update failed");
    }

  };

  /* ================= UI ================= */

  return (

    <div style={{
      maxWidth: "500px",
      margin: "auto",
      padding: "20px",
      fontFamily: "Arial",
      background: "#0f172a",
      minHeight: "100vh"
    }}>

      <h2 style={{
        color: "#38bdf8",
        fontSize: "32px",
        fontWeight: "800",
        textAlign: "center",
        marginBottom: "20px"
      }}>
        Edit Task
      </h2>

      <div style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "12px"
      }}>

        {/* TITLE */}
        <label style={label}>Task Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={input}
        />

        {/* DESCRIPTION */}
        <label style={label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={input}
        />

        {/* DEADLINE */}
        <label style={label}>Deadline</label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={input}
        />

        {/* PRIORITY */}
        <label style={label}>Priority</label>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "15px 0"
        }}>

          {["High", "Medium", "Low"].map(p => (
            <label key={p} style={{
              color: p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : "#22c55e",
              fontWeight: "bold"
            }}>
              <input
                type="radio"
                value={p}
                checked={priority === p}
                onChange={(e) => setPriority(e.target.value)}
              /> {p}
            </label>
          ))}

        </div>

        {/* UPDATE BUTTON */}
        <button onClick={updateTask} style={submitBtn}>
          Update Task
        </button>

      </div>

    </div>

  );

}

/* ================= STYLES ================= */

const label = {
  color: "#e2e8f0",
  fontWeight: "600",
  display: "block",
  marginTop: "10px"
};

const input = {
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  borderRadius: "8px",
  border: "none",
  background: "#334155",
  color: "#f8fafc",
  outline: "none"
};

const submitBtn = {
  width: "100%",
  padding: "12px",
  background: "#22c55e",
  border: "none",
  borderRadius: "8px",
  marginTop: "15px",
  cursor: "pointer",
  color: "white",
  fontSize: "16px",
  fontWeight: "700"
};

export default EditTask;