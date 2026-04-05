import React from "react";
import { useNavigate } from "react-router-dom";

function BottomNav(){

const navigate = useNavigate();

return(

<div style={{
position:"fixed",
bottom:"0",
left:"0",
width:"100%",
height:"70px",
background:"#0f172a",
display:"flex",
justifyContent:"space-around",
alignItems:"center",
color:"white",
boxShadow:"0px -2px 10px rgba(0,0,0,0.4)"
}}>

{/* HOME */}
<div onClick={()=>navigate("/dashboard")} style={{cursor:"pointer"}}>
🏠<br/>Home
</div>

{/* CALENDAR */}
<div onClick={()=>navigate("/calendar")} style={{cursor:"pointer"}}>
📅<br/>Calendar
</div>

{/* ADD BUTTON (CENTER BIG BUTTON) */}
<div
onClick={()=>navigate("/addtask")}
style={{
background:"#22c55e",
width:"60px",
height:"60px",
borderRadius:"50%",
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"28px",
color:"white",
marginTop:"-30px",
boxShadow:"0px 4px 10px rgba(0,0,0,0.5)",
cursor:"pointer"
}}
>
➕
</div>

{/* PROGRESS */}
<div onClick={()=>navigate("/progress")} style={{cursor:"pointer"}}>
📊<br/>Progress
</div>

{/* PROFILE */}
<div onClick={()=>navigate("/profile")} style={{cursor:"pointer"}}>
👤<br/>Profile
</div>

<div 
onClick={()=>navigate("/chat")}
style={{
  display:"flex",
  flexDirection:"column",
  alignItems:"center",
  color:"white",
  cursor:"pointer"
}}
>
  💬
  <p style={{margin:"0"}}>Chat</p>
</div>

</div>

);

}

export default BottomNav;