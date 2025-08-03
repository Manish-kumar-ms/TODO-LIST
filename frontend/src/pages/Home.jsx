// Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // ✅ import the Navbar
import socket from "../Socket";
const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/tasks/getalltasks",
          {
            withCredentials: true,
          }
        );
        setEvents(response.data.tasks);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();

    socket.on("taskDeleted", (taskId) => {
      setEvents((prev) => prev.filter((task) => task._id !== taskId));
    });

    socket.on("taskUpdated", (updatedTask) => {
      setEvents((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    socket.on("taskAdded", (newTask)=>{
      setEvents((prev) => [...prev, newTask]);
    } )

    // Clean up listeners when component unmounts
    return () => {
    socket.off("taskUpdated");
    socket.off("taskDeleted");
    };
    
  }, []);

  return (
    <>
      <Navbar /> {/* ✅ Sticky navbar at the top */}
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          All Tasks
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {events.map((event) => (
            <div
              key={event._id}
              onClick={() => navigate(`/task/${event._id}`)}
              className="cursor-pointer bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-t-4 border-blue-400"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-3">
                {event.description || "No description available."}
              </p>
              <div className="mt-4">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Priority: {event.priority || "Normal"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
