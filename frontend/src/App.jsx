import React, { useContext } from 'react'
import Login from './pages/Login'
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Home from './pages/Home'
import TaskDetails from './pages/TaskDetails'
import EditTask from './pages/Edittask'
import ActionLog from './pages/ActionLog'
import Profile from './pages/Profile'
import AddTask from './pages/AddTask'
import AssignedTasks from './pages/AllAssignedTask'
import { UserDataContext } from './context/UserContext'
const App = () => {
  const  {userData, setUserData,loading} = useContext(UserDataContext);

   if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
  <Routes>
  <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />} />
  <Route path="/login" element={userData ? <Navigate to="/" /> : <Login />} />
  <Route path="/signup" element={userData ? <Navigate to="/" /> : <Signup />} />

  <Route path="/home" element={userData ? <Home /> : <Navigate to="/login" />} />
  <Route path="/profile" element={userData ? <Profile /> : <Navigate to="/login" />} />
  <Route path="/addtask" element={userData ? <AddTask /> : <Navigate to="/login" />} />
  <Route path="/task/:id" element={userData ? <TaskDetails /> : <Navigate to="/login" />} />
  <Route path="/task/edit/:taskId" element={userData ? <EditTask /> : <Navigate to="/login" />} />
  <Route path="/task/actionlog/:id" element={userData ? <ActionLog /> : <Navigate to="/login" />} />
  <Route path="/task/assigned" element={userData ? <AssignedTasks /> : <Navigate to="/login" />} />
</Routes>

  )
}

export default App
