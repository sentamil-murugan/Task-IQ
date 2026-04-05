import React, { useEffect, useState } from "react";
import axios from "axios";

import { Bar } from "react-chartjs-2";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

function Progress(){

const [tasks,setTasks] = useState([]);
const [feedback,setFeedback] = useState("");
const [aiScore,setAiScore] = useState("");

/* ================= LOAD DATA ================= */

useEffect(()=>{
  loadTasks();
  getFeedback();
  getAIScore();
},[]);

const loadTasks = async () => {
  try{
    const userId = localStorage.getItem("user_id");
    const res = await axios.get(`http://localhost:5000/tasks/${userId}`);
    setTasks(res.data);
  }catch(error){
    console.log(error);
  }
};

const getFeedback = async () => {
  try{
    const res = await axios.get("http://localhost:5000/ai-feedback");
    setFeedback(res.data.feedback);
  }catch(error){
    console.log(error);
  }
};

const getAIScore = async () => {
  try{
    const res = await axios.get("http://localhost:5000/ai-score");
    setAiScore(res.data.result);
  }catch(error){
    console.log(error);
  }
};
/* ================= CALCULATIONS ================= */

const total = tasks.length;
const completed = tasks.filter(t => t.status === "completed").length;
const pending = total - completed;
const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

/* ================= STREAK ================= */

let streak = 0;

for(let i=0;i<7;i++){

const date = new Date();
date.setDate(date.getDate() - i);

const dayStr = date.toISOString().split("T")[0];

const completedToday = tasks.some(t =>
t.status === "completed" && t.deadline.startsWith(dayStr)
);

if(completedToday){
streak++;
}else{
break;
}

}

/* ================= WEEKLY DATA ================= */

const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const weeklyData = [0,0,0,0,0,0,0];

tasks.forEach(task => {
if(task.status === "completed"){
const day = new Date(task.deadline).getDay();
weeklyData[day]++;
}
});

/* ================= CHART ================= */

const chartData = {
labels: days,
datasets: [
{
label: "Completed Tasks",
data: weeklyData,
backgroundColor: "#22c55e",
borderRadius: 6
}
]
};

const chartOptions = {
responsive: true,
plugins: {
legend: {
labels: {
color: "#F8FAFC"
}
}
},
scales: {
x: {
ticks: {
color: "#E2E8F0"
},
grid: {
color: "#334155"
}
},
y: {
ticks: {
color: "#E2E8F0"
},
grid: {
color: "#334155"
}
}
}
};

/* ================= UI ================= */

return(

<div style={{
maxWidth:"600px",
margin:"auto",
padding:"20px",
fontFamily:"Arial"
}}>

<h2 style={{
textAlign:"center",
color:"#38bdf8",
fontWeight:"800"
}}>
📊 Productivity Dashboard
</h2>

{/* CARDS */}

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"15px",
marginTop:"20px"
}}>

<div style={cardStyle("#E3F2FD")}>
<h4>Total Tasks</h4>
<p>{total}</p>
</div>

<div style={cardStyle("#E8F5E9")}>
<h4>Completed</h4>
<p>{completed}</p>
</div>

<div style={cardStyle("#FFF3E0")}>
<h4>Pending</h4>
<p>{pending}</p>
</div>

<div style={cardStyle("#FFEBEE")}>
<h4>Completion %</h4>
<p>{percentage}%</p>
</div>

</div>

{/* PROGRESS BAR */}

<div style={{marginTop:"30px"}}>

<h3 style={{
color:"#38BDF8",
fontSize:"20px",
fontWeight:"700"
}}>
Overall Progress
</h3>

<div style={{
background:"#1e293b",
borderRadius:"10px",
overflow:"hidden"
}}>

<div style={{
width:`${percentage}%`,
background:"linear-gradient(90deg,#22c55e,#4ade80)",
padding:"10px",
color:"white",
textAlign:"center",
transition:"0.5s",
fontWeight:"bold"
}}>
{percentage}%
</div>

</div>

</div>

{/* WEEKLY CHART */}

<div style={{marginTop:"30px"}}>

<h3 style={{
color:"#4ADE80",
fontWeight:"700",
fontSize:"20px"
}}>
📊 Weekly Productivity
</h3>

<Bar data={chartData} options={chartOptions} />

</div>

{/* STREAK */}

<div style={{
marginTop:"25px",
padding:"15px",
borderRadius:"10px",
background:"linear-gradient(90deg,#1e293b,#0f172a)",
color:"#FACC15",
textAlign:"center",
fontWeight:"700"
}}>
🔥 Current Streak: {streak} days
</div>

{/* AI FEEDBACK */}

<div style={{
marginTop:"25px",
padding:"15px",
borderRadius:"10px",
background:"#0f172a",
color:"#f1f5f9"
}}>

<h4>🤖 AI Feedback</h4>

<p>{feedback || "No feedback yet"}</p>

</div>

{/* AI SCORE */}

<div style={{
marginTop:"20px",
padding:"15px",
borderRadius:"10px",
background:"#020617",
color:"#38bdf8"
}}>

<h4>🧠 AI Productivity Score</h4>

<pre style={{
whiteSpace:"pre-wrap",
lineHeight:"1.6",
fontWeight:"500"
}}>
{aiScore || "Analyzing your productivity..."}
</pre>

</div>

{/* PRODUCTIVITY MESSAGE */}

<div style={{
marginTop:"25px",
padding:"15px",
borderRadius:"10px",
background:"#0f2027",
color:"white",
textAlign:"center",
fontWeight:"600"
}}>

{percentage >= 80 && "🔥 Excellent Productivity!"}
{percentage >= 50 && percentage < 80 && "👍 Good Progress!"}
{percentage < 50 && "⚠️ Need Improvement!"}

</div>

</div>

);

}

/* CARD STYLE */

const cardStyle = (bg) => ({
background:bg,
padding:"15px",
borderRadius:"10px",
textAlign:"center",
fontWeight:"bold"
});

export default Progress;