import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>

      {/* ✅ LOGO ADDED */}
      <img src="/logo.png" alt="logo" style={styles.logo} />

      <h1 style={styles.title}>TaskIQ</h1>

      <button
        onClick={() => navigate("/login")}
        style={styles.login}
      >
        LOGIN
      </button>

      <button
        onClick={() => navigate("/signup")}
        style={styles.signup}
      >
        SIGN UP
      </button>

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", // 🔥 upgraded
    color: "white",
  },

  logo: {
    width: "15vw",        // 🔥 responsive
    maxWidth: "100px",
    minWidth: "70px",
    marginBottom: "20px",
  },

  title: {
    fontSize: "34px",
    fontWeight: "800",
    marginBottom: "35px",
    letterSpacing: "1px",
  },

  login: {
    width: "220px",
    padding: "14px",
    margin: "10px",
    background: "#4A90E2",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "0.3s",
  },

  signup: {
    width: "220px",
    padding: "14px",
    margin: "10px",
    background: "#4CD964",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "0.3s",
  },
};

export default Home;