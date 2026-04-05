
# 🚀 Task-IQ – Smart Task Manager

> A behavior-aware task manager that dynamically adjusts reminders based on user habits.

---

## 📌 Overview

Traditional task managers are passive — they store tasks but do not actively help users complete them.
**Task-IQ** introduces a behavior-aware system that tracks user activity and adapts reminder strategies to improve productivity.

---

## ✨ Key Features

### 🔐 User Authentication

* Secure login & signup
* User-specific task handling

### 📝 Task Management

* Add, edit, delete tasks
* Deadlines & priorities
* Mark tasks as completed

### 🔔 Smart Notification System

* Time-based reminders
* Priority-based alerts
* Cooldown system to prevent spam

### 🧠 Behavior Tracking

* Tracks task completion vs delay
* Stores delay duration
* Maintains user behavior history

### ⚡ Adaptive Reminders

* Classifies users as:

  * On-time
  * Late
  * Balanced
* Adjusts reminder timing dynamically

### 📊 Productivity Dashboard

* Total tasks
* Completed tasks
* Productivity %
* Behavior insights

### ⏰ Overdue Alerts

* One-time alerts for missed deadlines
* Prevents repeated notifications

---

## 🛠 Tech Stack

| Layer     | Technology          |
| --------- | ------------------- |
| Frontend  | React.js            |
| Backend   | Node.js, Express.js |
| Database  | MySQL               |
| API Style | REST APIs           |

---

## 🏗 System Architecture

Frontend (React) → Backend (Node.js/Express) → MySQL Database

---

## ▶️ How to Run the Project

### 1️⃣ Clone the Repository

git clone https://github.com/sentamil-murugan/Task-IQ.git
cd Task-IQ

---

### 2️⃣ Setup Backend

cd backend
npm install

---

### 3️⃣ Environment Setup

Create a `.env` file inside the `backend` folder:

GROQ_API_KEY=your_api_key_here
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=task_manager

---

### 4️⃣ Get Groq API Key

1. Go to: https://console.groq.com/
2. Create an account
3. Generate API key
4. Paste it in `.env`

---

### 5️⃣ Setup Database (MySQL)

Run this in MySQL:

CREATE DATABASE taskmanager;
USE taskmanager;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  description TEXT,
  deadline DATETIME,
  priority ENUM('Low','Medium','High') DEFAULT 'Medium',
  status ENUM('pending','completed') DEFAULT 'pending',
  notified_count INT DEFAULT 0,
  last_notified DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  description TEXT,
  deadline DATETIME,
  priority ENUM('Low','Medium','High') DEFAULT 'Medium',
  status ENUM('pending','completed') DEFAULT 'pending',
  notified_count INT DEFAULT 0,
  last_notified DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_behavior (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  task_id INT,
  completed_on_time BOOLEAN,
  delay_minutes FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE user_preferences (
  user_id INT PRIMARY KEY,
  start_time TIME,
  end_time TIME,
  deadline_type VARCHAR(50), 
  tasks_per_day INT,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

---

### 6️⃣ Run Backend

npm start

Backend runs at: http://localhost:5000

---

### 7️⃣ Run Frontend

Open new terminal:

cd frontend
npm install
npm start

Frontend runs at: http://localhost:3000

---

## 🔌 Sample API Endpoints

* POST /signup
* POST /login
* GET /tasks
* POST /tasks
* PUT /tasks/:id
* DELETE /tasks/:id

---

## 📸 Screenshots

(Add your UI screenshots here)

---

## 🧠 Behavior Logic

The system:

* Calculates delay ratio
* Classifies users:

  * late
  * on_time
  * balanced

### Logic:

* Late users → early reminders
* On-time users → normal reminders
* Balanced users → moderate reminders

---

## 🧪 Testing

* Tested tasks completed:

  * Before deadline
  * After deadline
* Verified behavior tracking in DB
* Observed dynamic reminder adjustments

---

## ⚠️ Challenges Faced

* Correct user-task mapping
* Avoiding duplicate notifications
* Designing behavior classification logic
* Handling time-based testing

---

## 🚀 Future Improvements

* Mobile push notifications
* AI-based task prediction
* Weekly analytics
* Cloud deployment (AWS / Firebase)
* OAuth login

---

## 👥 Team Members

* Sentamil
* Nishanth
* Dharani

---

## 📌 Conclusion

Task-IQ transforms a basic task manager into an intelligent productivity assistant using behavior tracking and adaptive logic.

---
