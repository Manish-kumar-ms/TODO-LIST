# 📝 Real-Time Collaborative To-Do List

A **real-time task management application** built with the **MERN stack** that allows users to:  
- Add, edit, and delete tasks.  
- Assign tasks to specific users.  
- Track **20 most recent actions** performed on each task, including **who made the change, what was changed, and when**.  
- See **live updates** of tasks, assignments, and action logs via **WebSocket (Socket.IO)**.  

---

## 🚀 Features

### 🔹 Authentication & User Management
- Secure **JWT-based authentication** (login, signup, logout).  
- Protected routes to ensure only authenticated users can access tasks.  

### 🔹 Task Management
- Create, edit, and delete tasks.  
- Assign tasks to specific users.  
- View all tasks or only assigned tasks.  

### 🔹 Real-Time Updates
- Uses **Socket.IO** for instant updates when tasks are:  
  - Added  
  - Updated  
  - Deleted  
- All connected users see changes **without refreshing the page**.  

### 🔹 Action Log
- Stores the **20 most recent changes** per task.  
- Each action log entry contains:  
  - The **user** who made the change.  
  - The **field(s)** changed.  
  - The **previous** and **new** values.  
  - **Timestamp** of the change.  

---

## 🛠️ Tech Stack

**Frontend:**  
- React.js  
- React Router  
- Context API for state management  
- Socket.IO client  

**Backend:**  
- Node.js + Express.js  
- MongoDB + Mongoose  
- Socket.IO server  
- JWT Authentication  

---

## 📦 Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/realtime-todo.git
cd realtime-todo
```

### 2️⃣ Install dependencies
#### Backend
```bash
cd backend
npm install
```
#### Frontend
```bash
cd ../frontend
npm install
```

### 3️⃣ Set up environment variables
Create a `.env` file in the `backend` directory:  
```
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

```

---

## ▶️ Running the App

### Start the backend
```bash
cd backend
npm run dev
```

### Start the frontend
```bash
cd frontend
npm start
```

---

## 🌐 WebSocket Events

### **Server Events**
- `taskCreated` → Broadcasts when a task is added.  
- `taskUpdated` → Broadcasts when a task is updated.  
- `taskDeleted` → Broadcasts when a task is removed.  
  

---



This project is licensed under the **MIT License**.  
