import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleError } from "../../Utils";
import Navbar from "./Navbar";
import socket from "../Socket";
import { UserDataContext } from "../context/UserContext";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { serverUrl } = useContext(UserDataContext);
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/tasks/gettask/${id}`,
          { withCredentials: true }
        );
        setTask(res.data.task);
      } catch (err) {
        console.error("Failed to fetch task:", err);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/auth/currentuser`, {
          withCredentials: true,
        });
        setCurrentUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchTask();
    fetchUser();

     // 🧠 WebSocket Listeners
  socket.on("taskUpdated", (updatedTask) => {
    if (updatedTask._id === id) {
      setTask(updatedTask);
    }
  });

  socket.on("taskDeleted", (deletedTaskId) => {
    if (deletedTaskId === id) {
      alert("This task has been deleted.");
      navigate("/home");
    }
  });

  return () => {
    socket.off("taskUpdated");
    socket.off("taskDeleted");
  };

  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${serverUrl}/api/tasks/deletetask/${id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success === false) {
        handleError(res.data.message);
      }
      else {
      // 👇 Emit socket event
      socket.emit("taskDeleted", id);
      navigate("/home");
    }
    } catch (err) {
      handleError("Failed to delete task");
      console.error(err);
    }
  };

  const handleEdit = () => {
    navigate(`/task/edit/${id}`);
  };

  const handleActionLog = () => {
    navigate(`/task/actionlog/${id}`);
  };

  if (!task) return <div className="text-center mt-10 text-lg">Loading...</div>;
   
 
  const isCreator = currentUser && task?.createdBy._id.toString() === currentUser._id.toString();

 return (
  <>
  <Navbar/>
  <div className="relative max-w-3xl mx-auto bg-white mt-10 p-8 rounded-xl shadow-lg border-t-4 border-purple-500">
    
    {/* Status Badge at Top-Right */}
    <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 font-semibold text-sm px-3 py-1 rounded-full shadow">
      Status: {task.status}
    </div>

    <h1 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h1>
    <p className="text-gray-700 mb-4">{task.description}</p>
    
    <p className="text-sm text-gray-600 mb-2">
      Assigned to:{" "}
      {task.assignedTo?.length > 0
        ? task.assignedTo.map((user) => user.name).join(", ")
        : "Unassigned"}
    </p>

    <p className="text-sm text-gray-600 mb-6">Priority: {task.priority}</p>

    <div className="flex gap-4">
      <button
        onClick={handleEdit}
        className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg"
      >
        Edit
      </button>

      {isCreator && (
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Delete
        </button>
      )}

      <button
        onClick={handleActionLog}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        ActionDone
      </button>
    </div>
  </div>
  </>
);

};

export default TaskDetails;
