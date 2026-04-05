import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function Profile(){

const [data,setData] = useState({});
const navigate = useNavigate();

useEffect(()=>{
 loadProfile();
},[]);

const loadProfile = async () => {
  const userId = localStorage.getItem("user_id");
  const res = await axios.get(`http://localhost:5000/profile/${userId}`);
  setData(res.data);
};

const logout = () => {
  localStorage.clear();
  navigate("/");
};

return(

<div style={container}>

<h2 style={title}>👤 Profile</h2>

{/* PROFILE CARD */}
<div style={card}>

<img
src={data.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
alt="profile"
style={avatar}
/>

<h3>{data.name}</h3>
<p>{data.email}</p>

</div>

{/* STATS */}
<div style={card}>
<h4>📊 Stats</h4>
<p>Total Tasks: {data.total}</p>
<p>Completed: {data.completed}</p>
<p>Productivity: {data.productivity}%</p>
</div>

{/* BEHAVIOR */}
<div style={card}>
<h4>🧠 Behavior Insights</h4>
<p>✔ On Time: {data.onTime}</p>
<p>⏰ Late: {data.late}</p>
<p>📉 Avg Delay: {data.avgDelay} mins</p>

<p style={{
fontWeight:"bold",
color:
data.label === "Highly Productive" ? "#22c55e" :
data.label === "Needs Improvement" ? "#ef4444" :
"#f59e0b"
}}>
🔥 {data.label}
</p>

</div>

{/* BUTTONS */}
<button onClick={()=>navigate("/edit-profile")} style={btn}>
Edit Profile
</button>

<button onClick={logout} style={logoutBtn}>
Logout
</button>

<BottomNav/>

</div>

);

}

/* STYLES */
const container = {
maxWidth:"600px",
margin:"auto",
padding:"20px",
paddingBottom:"100px",
background:"#0f172a",
minHeight:"100vh",
color:"white"
};

const title = {
textAlign:"center",
color:"#38bdf8"
};

const card = {
background:"#1e293b",
padding:"20px",
borderRadius:"12px",
marginBottom:"20px",
textAlign:"center",
boxShadow:"0 4px 15px rgba(0,0,0,0.4)"
};

const avatar = {
width:"100px",
height:"100px",
borderRadius:"50%",
marginBottom:"10px",
border:"3px solid #38bdf8"
};

const btn = {
width:"100%",
padding:"12px",
background:"#22c55e",
border:"none",
borderRadius:"8px",
color:"white",
marginTop:"10px"
};

const logoutBtn = {
width:"100%",
padding:"12px",
background:"#ef4444",
border:"none",
borderRadius:"8px",
color:"white",
marginTop:"10px"
};

export default Profile;