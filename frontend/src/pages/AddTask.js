import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddTask(){

const navigate = useNavigate();

const [title,setTitle] = useState("");
const [description,setDescription] = useState("");
const [deadline,setDeadline] = useState("");
const [priority,setPriority] = useState("Medium");
const [reminder,setReminder] = useState("1 day before");
const [aiSuggestion,setAiSuggestion] = useState("");

/* ================= FORMAT FUNCTION ================= */

const formatDeadline = (value) => {
  if (!value) return "";

  const date = new Date(value);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:00`;
};



/* ================= AI ================= */

const getAISuggestion = async () => {
 try{

  const formattedDeadline = formatDeadline(deadline);

  const res = await axios.post("http://localhost:5000/ai-priority",{
    title,
    description,
    deadline: formattedDeadline
  });

  const { priority, reason } = res.data;

  setAiSuggestion(`${priority} → ${reason}`);

  setPriority(priority);

 }catch(error){
  console.log(error);
  alert("AI suggestion failed");
 }
};



/* ================= ADD ================= */

const addTask = async () => {
 try{

  const userId = localStorage.getItem("user_id");
  console.log("ADDING TASK FOR USER:", userId);

await axios.post("http://localhost:5000/tasks", {
  title,
  description,
  deadline : formatDeadline(deadline),
  priority,
  reminder,
  user_id: userId   // 🔥 ADD THIS
});

  alert("Task Added Successfully");
  navigate("/dashboard");

 }catch(error){
  console.log("FULL ERROR:", error);
  console.log("RESPONSE:", error.response);
  alert("Error adding task");
}
};


/* ================= UI ================= */

return(

<div style={{
maxWidth:"500px",
margin:"auto",
padding:"20px",
fontFamily:"Arial",
background:"#0f172a",
minHeight:"100vh"
}}>

<h2 style={{
color:"#38bdf8",
fontSize:"32px",
fontWeight:"800",
textAlign:"center",
marginBottom:"20px"
}}>
Add New Task
</h2>

<div style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 4px 20px rgba(0,0,0,0.4)"
}}>

{/* TITLE */}
<label style={label}>Task Title</label>
<input
value={title}
onChange={(e)=>setTitle(e.target.value)}
style={input}
/>

{/* DESCRIPTION */}
<label style={label}>Description</label>
<textarea
value={description}
onChange={(e)=>setDescription(e.target.value)}
style={input}
/>

{/* DEADLINE */}
<label style={label}>Deadline</label>
<input
type="datetime-local"
value={deadline}
onChange={(e)=>setDeadline(e.target.value)}
style={input}
/>

{/* PRIORITY */}
<label style={label}>Priority</label>

<div style={{
display:"flex",
justifyContent:"space-between",
margin:"15px 0"
}}>

{["High","Medium","Low"].map(p=>(
<label key={p} style={{
color: p==="High"?"#ef4444":p==="Medium"?"#f59e0b":"#22c55e",
fontWeight:"bold"
}}>
<input
type="radio"
value={p}
checked={priority===p}
onChange={(e)=>setPriority(e.target.value)}
/> {p}
</label>
))}

</div>

{/* REMINDER */}
<label style={label}>Reminder</label>
<select
value={reminder}
onChange={(e)=>setReminder(e.target.value)}
style={input}
>
<option>1 day before</option>
<option>2 days before</option>
<option>1 hour before</option>
<option>On deadline</option>
</select>

{/* AI BUTTON */}
<button onClick={getAISuggestion} style={aiBtn}>
🤖 Get AI Suggestion
</button>

{/* AI RESULT */}
{aiSuggestion && (
<div style={{
background:"#052e16",
padding:"12px",
borderRadius:"8px",
marginTop:"10px",
color:"#4ade80"
}}>
<b>AI Suggestion</b>
<p>{aiSuggestion}</p>
</div>
)}

{/* SUBMIT */}
<button onClick={addTask} style={submitBtn}>
Create Task
</button>

</div>

</div>

);

}

/* ================= STYLES ================= */

const label = {
color:"#e2e8f0",
fontWeight:"600",
display:"block",
marginTop:"10px"
};

const input = {
width:"100%",
padding:"12px",
marginTop:"6px",
borderRadius:"8px",
border:"none",
background:"#334155",
color:"#f8fafc",
outline:"none"
};

const aiBtn = {
width:"100%",
padding:"10px",
background:"#38bdf8",
border:"none",
borderRadius:"8px",
marginTop:"15px",
cursor:"pointer",
color:"white",
fontWeight:"600"
};

const submitBtn = {
width:"100%",
padding:"12px",
background:"#22c55e",
border:"none",
borderRadius:"8px",
marginTop:"15px",
cursor:"pointer",
color:"white",
fontSize:"16px",
fontWeight:"700"
};

export default AddTask;