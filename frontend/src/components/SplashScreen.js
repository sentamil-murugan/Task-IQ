import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home"); // or "/login"
    }, 3000); // ✅ 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <img src="/logo.png" alt="logo" style={styles.logo} />
      <h1 style={styles.title}>TaskIQ</h1>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", // 🔥 premium gradient
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
  width: "25vw",        // 🔥 responsive width (25% of screen)
  maxWidth: "300px",    // don’t get too big
  minWidth: "150px",    // don’t get too small
  height: "auto",
  objectFit: "contain",
  marginBottom: "20px",
  borderRadius: "25px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  animation: "popIn 1.2s ease-out",
},

  title: {
    color: "#ffffff",
    fontSize: "26px",
    fontWeight: "600",
    letterSpacing: "1px",
    animation: "fadeIn 2s ease-in",
  },
};

export default SplashScreen;