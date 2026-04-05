import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async () => {

    // 🔒 VALIDATION
    if (!email || !password) {
      alert("Please enter email and password ❌");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post("http://localhost:5000/login", {
        email,
        password
      });

      console.log("LOGIN RESPONSE:", res.data);

      // ✅ SAFE USER EXTRACTION
      const userId = res.data.user_id;
      const username = res.data.name;

      if (!userId) {
        alert("Login failed: User ID missing ❌");
        return;
      }

      // ✅ STORE DATA
      localStorage.setItem("user_id", userId);
      localStorage.setItem("username", username);

      console.log("STORED USER:", userId, username);

      alert("Login successful ✅");

      navigate("/dashboard");

    } catch (error) {

      console.log("LOGIN ERROR:", error);

      // 🔥 SHOW BACKEND ERROR IF EXISTS
      const msg = error.response?.data || "Login failed ❌";
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
      background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
      fontFamily: "Arial"
    }}>

      <div style={{
        background: "rgba(255,255,255,0.08)",
        padding: "40px",
        borderRadius: "12px",
        width: "330px",
        backdropFilter: "blur(10px)",
        boxShadow: "0px 10px 25px rgba(0,0,0,0.4)",
        textAlign: "center",
        color: "white"
      }}>

        <img
          src="/logo.png"
          alt="logo"
          style={{ width: "70px", marginBottom: "15px" }}
        />

        <h2 style={{ marginBottom: "25px", fontWeight: "700" }}>
          Login
        </h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {/* BUTTON */}
        <button
          onClick={loginUser}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#6b7280" : "#06b6d4",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP LINK */}
        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Don't have an account?

          <span
            onClick={() => navigate("/signup")}
            style={{
              color: "#38bdf8",
              cursor: "pointer",
              marginLeft: "5px"
            }}
          >
            Sign up
          </span>
        </p>

      </div>

    </div>
  );
}

// 🔹 Input style
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
  background: "#e5e7eb",
  color: "black"
};

export default Login;