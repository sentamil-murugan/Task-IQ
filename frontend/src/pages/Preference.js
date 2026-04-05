import React, { useState } from "react";
import axios from "axios";
function Preference(){

const [fromTime,setFromTime] = useState("");
const [toTime,setToTime] = useState("");
const [deadlineStyle,setDeadlineStyle] = useState("");
const [tasksPerDay,setTasksPerDay] = useState(5);


const formatTime = (time) => {
  const [hour, minute, period] = time.split(/[: ]/);
  let h = parseInt(hour);

  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  return `${h.toString().padStart(2, '0')}:${minute}:00`;
};
const savePreference = async () => {

 try {

  const user_id = localStorage.getItem("user_id");

 await axios.post("http://localhost:5000/preferences", {
  user_id,
  start_time: formatTime(fromTime),
  end_time: formatTime(toTime),
  deadline_type: deadlineStyle,
  tasks_per_day: tasksPerDay
});

  alert("Preferences Saved ✅");

  window.location.href = "/dashboard";

 } catch (error) {

  console.log("ERROR SAVING PREF:", error);
  alert("Failed to save preferences ❌");

 }

};
return(

<div style={{textAlign:"center",marginTop:"50px"}}>

<h2 style={{
color:"#F8FAFC",
fontSize:"28px",
fontWeight:"700"
}}>
Select Your Preference!
</h2>

<p style={{
color:"#E2E8F0",
fontWeight:"600"
}}>
1) What time are you usually most productive?
</p>

<div>

<label style={{color:"#CBD5F5"}}>
From
</label>
<input 
type="time"
value={fromTime}
onChange={(e)=>setFromTime(e.target.value)}
style={{padding:"10px",width:"200px"}}
/>

<label style={{color:"#CBD5F5"}}>
To
</label>
<input 
type="time"
value={toTime}
onChange={(e)=>setToTime(e.target.value)}
style={{padding:"10px",width:"200px"}}
/>

</div>

<br/>

<p style={{
color:"#E2E8F0",
fontWeight:"600"
}}>
2) How do you usually handle deadlines?
</p>

<div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>

<label>
<input
type="radio"
name="deadline"
value="early"
checked={deadlineStyle==="early"}
onChange={(e)=>setDeadlineStyle(e.target.value)}
/>
<label style={{color:"#F1F5F9"}}>
Finish task early
</label>
</label>

<label>
<input
type="radio"
name="deadline"
value="close"
checked={deadlineStyle==="close"}
onChange={(e)=>setDeadlineStyle(e.target.value)}
/>
<label style={{color:"#F1F5F9"}}>
Finish task close to deadline
</label>
</label>

<label>
<input
type="radio"
name="deadline"
value="delay"
checked={deadlineStyle==="delay"}
onChange={(e)=>setDeadlineStyle(e.target.value)}
/>
<label style={{color:"#F1F5F9"}}>
Delay until last moment
</label>
</label>

</div>

<br/>

<p style={{
color:"#E2E8F0",
fontWeight:"600"
}}>
3) How many tasks do you manage per day?
</p>


<select
value={tasksPerDay}
onChange={(e)=>setTasksPerDay(e.target.value)}
style={{padding:"10px"}}
>

<option value="3">3</option>
<option value="5">5</option>
<option value="8">8</option>
<option value="10">10</option>

</select>

<br/><br/>

<button
onClick={savePreference}
style={{
padding:"12px",
width:"200px",
background:"#ff9800",
border:"none"
}}
>
Save Preference
</button>

</div>

);

}

export default Preference;