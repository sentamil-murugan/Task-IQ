import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";

function CalendarPage(){

const [date,setDate] = useState(new Date());
const [tasks,setTasks] = useState([]);
const [selectedTasks,setSelectedTasks] = useState([]);

/* ================= LOAD TASKS ================= */

useEffect(()=>{
loadTasks();
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

/* ================= DATE CLICK ================= */

const handleDateClick = (selectedDate) => {

setDate(selectedDate);

const formatted = selectedDate.toISOString().split("T")[0];

const filtered = tasks.filter(task =>
task.deadline.startsWith(formatted)
);

setSelectedTasks(filtered);

};

/* ================= PRIORITY COLOR ================= */

const getPriorityColor = (priority) => {

if(priority === "High") return "#ef4444";
if(priority === "Medium") return "#facc15";
return "#22c55e";

};

/* ================= CALENDAR ================= */

return(

<div style={{
padding:"40px",
maxWidth:"550px",
margin:"auto",
color:"white"
}}>

<h2 style={{textAlign:"center",marginBottom:"20px"}}>
📅 Calendar
</h2>

{/* CALENDAR BOX */}

<div style={{
background:"white",
borderRadius:"12px",
padding:"20px"
}}>

<Calendar
onChange={handleDateClick}
value={date}

/* SHOW DOTS ON TASK DATES */

tileContent={({ date, view }) => {

if(view === "month"){

const formatted = date.toISOString().split("T")[0];

const count = tasks.filter(task =>
task.deadline.startsWith(formatted)
).length;

if(count > 0){

return(
<div style={{
marginTop:"3px",
textAlign:"center",
fontSize:"12px",
color:"#22c55e"
}}>
{"•".repeat(count)}
</div>
);

}

}

}}

 />

</div>

{/* PRIORITY LEGEND */}

<div style={{marginTop:"20px"}}>

<div style={{display:"flex",gap:"10px",alignItems:"center"}}>
<div style={{width:"12px",height:"12px",background:"#ef4444"}}></div>
<p>High Priority</p>
</div>

<div style={{display:"flex",gap:"10px",alignItems:"center"}}>
<div style={{width:"12px",height:"12px",background:"#facc15"}}></div>
<p>Medium Priority</p>
</div>

<div style={{display:"flex",gap:"10px",alignItems:"center"}}>
<div style={{width:"12px",height:"12px",background:"#22c55e"}}></div>
<p>Low Priority</p>
</div>

</div>

{/* TASK LIST */}

<div style={{marginTop:"25px"}}>

<h3>Tasks for {date.toDateString()}</h3>

{selectedTasks.length === 0 && (
<p>No tasks scheduled.</p>
)}

{selectedTasks.map(task => (

<div
key={task.id}
style={{
background:getPriorityColor(task.priority),
padding:"15px",
borderRadius:"12px",
marginBottom:"15px",
color:"white",
boxShadow:"0px 4px 10px rgba(0,0,0,0.2)"
}}
>

<h4 style={{marginBottom:"5px"}}>
{task.title}
</h4>

<p style={{fontSize:"14px",opacity:"0.9"}}>
{task.description}
</p>

<p style={{marginTop:"5px"}}>
Priority: {task.priority}
</p>

</div>

))}

</div>

</div>

);

}

export default CalendarPage;