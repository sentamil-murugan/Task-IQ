import React, { useState } from "react";
import axios from "axios";

function AIChat(){

const [message,setMessage] = useState("");
const [chat,setChat] = useState([]);

const sendMessage = async () => {

if(!message.trim()) return;

const userMsg = {type:"user",text:message};
setChat(prev => [...prev,userMsg]);

try{

axios.post("http://localhost:5000/ai-chat", {
  message: message   // ✅ explicit
}).then(res => {
  const botMsg = {type:"bot",text:res.data.reply};
  setChat(prev => [...prev,botMsg]);
});

setMessage("");

}catch(error){

alert("AI failed");

}

};

return(

<div style={{
maxWidth:"600px",
margin:"auto",
padding:"20px",
fontFamily:"Arial"
}}>

<h2 style={{color:"#38bdf8"}}>🧠 AI Productivity Coach</h2>

<div style={{
height:"400px",
overflowY:"auto",
background:"#020617",
padding:"15px",
borderRadius:"10px",
marginBottom:"15px"
}}>

{chat.map((c,i)=>(
<div key={i} style={{
textAlign: c.type==="user" ? "right" : "left",
marginBottom:"10px"
}}>

<span style={{
background: c.type==="user" ? "#4ADE80" : "#1e293b",
color:"white",
padding:"10px",
borderRadius:"10px",
display:"inline-block"
}}>
{c.text}
</span>

</div>
))}

</div>

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder="Ask about your productivity..."
style={{
width:"100%",
padding:"10px",
borderRadius:"8px",
marginBottom:"10px"
}}
/>

<button
onClick={sendMessage}
style={{
width:"100%",
padding:"10px",
background:"#38bdf8",
border:"none",
borderRadius:"8px",
color:"white"
}}
>
Send
</button>

</div>

);

}

export default AIChat;