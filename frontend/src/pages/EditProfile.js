import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditProfile(){

const [name,setName] = useState("");
const [image,setImage] = useState("");

const navigate = useNavigate();

/* ================= LOAD EXISTING DATA ================= */

useEffect(() => {
  loadProfile();
}, []);

const loadProfile = async () => {
  try {

    const userId = localStorage.getItem("user_id");

    console.log("USER ID:", userId); // 🔥 DEBUG

    if (!userId) {
      alert("User not logged in");
      return;
    }

    const res = await axios.get(`http://localhost:5000/profile/${userId}`);

    setName(res.data.name || "");
    setImage(res.data.profile_pic || "");

  } catch (error) {
    console.log("LOAD ERROR:", error);
    alert("Failed to load profile");
  }
};

/* ================= IMAGE HANDLER ================= */

const handleImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    setImage(reader.result);
  };

  reader.readAsDataURL(file);
};

/* ================= SAVE ================= */

const save = async () => {

  try {

    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("User not logged in");
      return;
    }

    await axios.put(`http://localhost:5000/profile/${userId}`, {
      name,
      profile_pic: image || ""
    });

    alert("Profile updated");
    navigate("/profile");

  } catch (error) {
    console.log("SAVE ERROR:", error.response?.data || error.message);
    alert("Update failed");
  }

};

/* ================= UI ================= */

return(

<div style={{
padding:"20px",
maxWidth:"500px",
margin:"auto",
color:"white",
background:"#0f172a",
minHeight:"100vh"
}}>

<h2>Edit Profile</h2>

{/* PROFILE PREVIEW */}
{image && (
  <img
    src={image}
    alt="preview"
    style={{
      width:"100px",
      height:"100px",
      borderRadius:"50%",
      marginBottom:"10px"
    }}
  />
)}

{/* NAME */}
<input
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Enter name"
style={input}
/>

<br/><br/>

{/* IMAGE */}
<input type="file" onChange={handleImage}/>

<br/><br/>

<button onClick={save} style={btn}>
Save Changes
</button>

</div>

);

}

/* STYLES */

const input = {
width:"100%",
padding:"10px",
borderRadius:"8px",
border:"none",
background:"#334155",
color:"white"
};

const btn = {
width:"100%",
padding:"12px",
background:"#22c55e",
border:"none",
borderRadius:"8px",
color:"white"
};

export default EditProfile;