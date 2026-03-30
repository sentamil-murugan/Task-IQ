#  Smart Task Manager

An intelligent task management system that adapts to user behavior and improves productivity through smart notifications and analytics.

---

##  Overview

Traditional task managers are passive — they store tasks but do not actively help users complete them.  
This project introduces a **behavior-aware task management system** that tracks user activity and dynamically adjusts reminder strategies.

---

##  Key Features

###  User Authentication
- Secure login system
- User-specific task management using `user_id`

###  Task Management
- Add, edit, delete tasks
- Set deadlines and priorities
- Mark tasks as completed

###  Smart Notification System
- Time-based reminders
- Priority-based alerts
- Spam protection using cooldown logic

###  Behavior Tracking
- Tracks whether tasks are completed on time or delayed
- Stores delay duration in minutes
- Maintains history in `user_behavior` table

###  Adaptive Reminders
- Classifies users as:
  - On-time users
  - Late users
  - Balanced users
- Adjusts notification timing dynamically

###  Productivity Dashboard
- Total tasks
- Completed tasks
- Productivity percentage
- Behavior insights (on-time vs late)

###  Overdue Alerts
- Sends alerts when deadlines are missed
- Ensures one-time notification to avoid spam

---

##  Tech Stack

| Layer       | Technology            |
|------------|----------------------|
| Frontend   | React.js             |
| Backend    | Node.js, Express.js  |
| Database   | MySQL                |
| API Style  | REST APIs            |

---

## ⚙️ System Architecture

Frontend (React) communicates with backend APIs (Node.js/Express), which handle business logic and interact with the MySQL database.



---

##  Behavior Logic

The system analyzes user history:

- Calculates delay ratio
- Determines user type:
  - `late`
  - `on_time`
  - `balanced`

Based on this classification:
- Late users → receive earlier reminders
- On-time users → receive normal reminders
- Balanced users → receive moderate reminders

---

##  Testing Approach

- Simulated user behavior by completing tasks:
  - Before deadline
  - After deadline
- Verified behavior tracking in database
- Observed changes in notification timing

---

##  Challenges Faced

- Ensuring correct user-task mapping using `user_id`
- Preventing duplicate notifications
- Designing reliable behavior classification logic
- Handling time-based testing scenarios

---

##  Future Improvements

-  Mobile push notifications
-  AI-based task prediction
-  Weekly productivity analytics
-  Cloud deployment (AWS / Firebase)
-  OAuth login (Google authentication)

---

##  Team Members

This project was developed collaboratively by:

- **Sentamil Murugan**
- **[Teammate 2 Name]**
- **[Teammate 3 Name]**

---

##  Conclusion

This project transforms a basic task manager into an intelligent productivity assistant by combining behavior tracking, adaptive logic, and smart notifications.

---

