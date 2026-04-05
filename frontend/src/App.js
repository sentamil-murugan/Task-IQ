import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddTask from "./pages/AddTask";
import CalendarPage from "./pages/CalendarPage";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Preference from "./pages/Preference";
import AIChat from "./pages/AIChat";
import EditTask from "./pages/EditTask";
import EditProfile from "./pages/EditProfile";
import AppLayout from "./components/AppLayout";
import SplashScreen from "./components/SplashScreen";

function App() {
  return (
    <Router>
      <Routes>

        {/* SPLASH SCREEN FIRST */}
        <Route path="/" element={<SplashScreen />} />

        {/* PUBLIC PAGES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />

        {/* PROTECTED / APP PAGES */}
        <Route element={<AppLayout />}>
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addtask" element={<AddTask />} />
          <Route path="/edit/:id" element={<EditTask />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/preference" element={<Preference />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;