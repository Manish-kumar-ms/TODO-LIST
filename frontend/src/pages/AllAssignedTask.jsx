import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AssignedTasks = () => {
  const navigate = useNavigate();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/tasks/getallAssignedTasks", {
          withCredentials: true,
        });
        setAssignedTasks(res.data.tasks);
      } catch (err) {
        console.error("Error fetching assigned tasks", err);
      }
    };



    fetchAssignedTasks();

  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Assigned Tasks</h1>

      {assignedTasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned to you yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {assignedTasks.map((task) => (
            <div
              key={task._id}
              onClick={() => navigate(`/task/${task._id}`)}
              className="relative cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4 border-blue-500"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
              <div className="mt-2 text-xs text-gray-500">Priority: {task.priority}</div>

              {/* Task Status badge */}
              <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-semibold
                ${task.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : task.status === "in-progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
                }`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedTasks;
