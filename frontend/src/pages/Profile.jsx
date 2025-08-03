// Profile.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const navigate = useNavigate();
  const { serverUrl } = useContext(UserDataContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/auth/currentuser`,
          {
            withCredentials: true,
          }
        );
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

   

    fetchUserData();
  }, []);

  if (!user)
    return <div className="text-center mt-10 text-lg">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome, {user.name}
      </h1>
      <p className="text-gray-600 mb-4">Email: {user.email}</p>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">Assigned Tasks</h2>
        <Link
          to="/task/assigned"
          className="text-sm text-blue-600 hover:underline"
        >
          👉 View your assigned tasks
        </Link>
      </div>

      <hr className="my-6 border-gray-300" />

      <h2 className="text-2xl font-semibold text-purple-700 mb-4">
        Your Created Tasks
      </h2>

      {userTasks.length === 0 ? (
        <p className="text-gray-500">You haven't created any tasks yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {userTasks.map((task) => (
            <div
              key={task._id}
              onClick={() => navigate(`/task/${task._id}`)}
              className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4 border-purple-500"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {task.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {task.description}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Priority: {task.priority}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
