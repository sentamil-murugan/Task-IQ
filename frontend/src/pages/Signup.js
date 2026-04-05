import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {

    // 🔒 Basic validation
    if (!name || !email || !password) {
      alert("Please fill all fields ❌");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
        role
      });

      console.log("REGISTER SUCCESS:", res.data);

      // ✅ GET USER ID SAFELY
      const userId = res.data?.user?.id;

      if (!userId) {
        alert("User ID not received ❌");
        return;
      }

      // ✅ STORE DATA
      localStorage.setItem("username", name);
      localStorage.setItem("user_id", userId);

      console.log("STORED USER ID:", userId);

      alert("Account Created Successfully ✅");

      // 🚀 GO TO PREFERENCE
      navigate("/preference");

    } catch (error) {

      console.log("REGISTER ERROR:", error);

      // 🔥 SHOW BACKEND ERROR
      const msg = error.response?.data || "Error creating account ❌";
      alert(msg);

    } finally {
      setLoading(false);
    }
  };

  return (

    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0f2027",
      color: "white"
    }}>

      <div style={{
        background: "#1f2937",
        padding: "40px",
        borderRadius: "12px",
        width: "320px",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.4)"
      }}>

        <img
          src="/logo.png"
          alt="logo"
          style={{
            width: "70px",
            display: "block",
            margin: "0 auto 15px auto"
          }}
        />

        <h2 style={{
          textAlign: "center",
          marginBottom: "25px",
          fontWeight: "700"
        }}>
          Create Account
        </h2>

        {/* NAME */}
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        {/* EMAIL */}
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        {/* PASSWORD */}
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {/* ROLE */}
        <label>Role</label>
        <div style={{ marginTop: "10px", marginBottom: "20px" }}>
          {["Student", "Teacher", "Professional"].map((r) => (
            <label key={r} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                value={r}
                checked={role === r}
                onChange={(e) => setRole(e.target.value)}
              />
              {r}
            </label>
          ))}
        </div>

        {/* BUTTON */}
        <button
          onClick={registerUser}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#6b7280" : "#22c55e",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          {loading ? "Creating..." : "SIGN UP"}
        </button>

        <p style={{
          marginTop: "15px",
          textAlign: "center",
          fontSize: "14px"
        }}>
          Already have an account?

          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#60a5fa",
              cursor: "pointer",
              marginLeft: "5px"
            }}
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

// 🔹 Reusable input style
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
  background: "#e5e7eb",
  color: "black"
};

export default Signup;