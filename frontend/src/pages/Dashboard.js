import React, { useEffect, useState } from "react";
import axios from "axios";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [insights, setInsights] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();

  /* ================= LOAD DATA ================= */

  const loadTasks = async () => {
    const userId = localStorage.getItem("user_id");
    const res = await axios.get(`http://localhost:5000/tasks/${userId}`);
    setTasks(res.data);
  };

  const loadInsights = async () => {
    const userId = localStorage.getItem("user_id");
    const res = await axios.get(`http://localhost:5000/ai-insights/${userId}`);
    setInsights(res.data);
  };

  const loadHistory = async () => {
    const userId = localStorage.getItem("user_id");
    const res = await axios.get(`http://localhost:5000/delay-history/${userId}`);
    setHistory(res.data);
  };

  const loadNotifications = async () => {
    const userId = localStorage.getItem("user_id");
    const res = await axios.get(`http://localhost:5000/notifications/${userId}`);
    setNotifications(res.data);

    res.data.forEach(n => showNotification(n));
  };

  /* ================= NOTIFICATIONS ================= */

  const showNotification = (notif) => {
    if (Notification.permission === "granted") {
      new Notification("Task Alert 🚨", { body: notif.message });
    }
  };

  useEffect(() => {
    Notification.requestPermission();

    loadTasks();
    loadInsights();
    loadHistory();
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  /* ================= HELPERS ================= */

  const formatDate = (d) => new Date(d).toLocaleString();

  const getColor = (confidence, status) => {
    if (status === "completed") return "#64748b";
    if (confidence > 0.7) return "#ef4444";
    if (confidence > 0.4) return "#f59e0b";
    return "#22c55e";
  };

  const delayedTasks = history.filter(h => !h.completed_on_time);
  const delayedCount = delayedTasks.length;

  /* ================= ACTIONS ================= */

  const deleteTask = async (id) => {
    const userId = localStorage.getItem("user_id");
    await axios.delete(`http://localhost:5000/tasks/${id}/${userId}`);
    loadTasks();
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";

    await axios.put(`http://localhost:5000/tasks/${task.id}`, {
      status: newStatus
    });

    loadTasks();
    loadHistory(); // important for tracking delay
  };

  /* ================= UI ================= */

  return (
    <div style={{ padding: "20px", background: "#0f172a", minHeight: "100vh", color: "white" }}>

      <h2 style={{ textAlign: "center", color: "#38bdf8" }}>Your Tasks</h2>

      {/* 🔔 Notifications */}
      {notifications.map((n, i) => (
        <div key={i} style={{ color: "#facc15" }}>{n.message}</div>
      ))}

      {/* 📉 DELAY SUMMARY */}
      <h3 style={{ color: "#ef4444", marginTop: "20px" }}>
        📉 You delayed {delayedCount} tasks
      </h3>

      {/* 📉 DELAY HISTORY */}
      {delayedTasks.map((h, i) => (
        <div key={i} style={{
          border: "1px solid #ef4444",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px",
          background: "#1e293b"
        }}>
          <b>{h.title}</b>
          <p style={{ fontSize: "12px" }}>
            Delayed by {Math.round(h.delay_minutes)} mins
          </p>
        </div>
      ))}

      {/* 📋 TASK LIST */}
      {tasks.map(task => {

        const insight = insights.find(i => i.id === task.id);
        const confidence = insight?.confidence || 0;
        const willDelay = insight?.willDelay;
        const borderColor = getColor(confidence, task.status);

        return (
          <div key={task.id} style={{
            border: `2px solid ${borderColor}`,
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px",
            background: "#1e293b"
          }}>

            <h3 style={{
              textDecoration: task.status === "completed" ? "line-through" : "none",
              color: task.status === "completed" ? "#9ca3af" : "#fff"
            }}>
              {task.title}
            </h3>

            {/* 🤖 AI Badge */}
            {insight && (
              <span style={{
                background: willDelay ? "#ef4444" : "#22c55e",
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "12px"
              }}>
                {willDelay ? "⚠️ Risk" : "✅ Safe"}
              </span>
            )}

            {/* 📊 Confidence Bar */}
            {insight && (
              <div style={{
                height: "6px",
                background: "#334155",
                marginTop: "8px",
                borderRadius: "5px"
              }}>
                <div style={{
                  width: `${confidence * 100}%`,
                  background: borderColor,
                  height: "100%",
                  borderRadius: "5px"
                }} />
              </div>
            )}

            <p>{task.description}</p>
            <p>{formatDate(task.deadline)}</p>

            <p style={{
              color:
                task.status === "completed"
                  ? "#22c55e"
                  : new Date(task.deadline) < new Date()
                    ? "#ef4444"
                    : "#f59e0b"
            }}>
              {task.status}
            </p>

            <button onClick={() => deleteTask(task.id)}>Delete</button>
            <button onClick={() => navigate(`/edit/${task.id}`)}>Edit</button>
            <button onClick={() => toggleStatus(task)}>
              {task.status === "completed" ? "Undo" : "Done"}
            </button>

          </div>
        );
      })}

      <BottomNav />

    </div>
  );
}

export default Dashboard;