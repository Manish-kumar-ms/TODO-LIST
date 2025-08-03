// components/Navbar.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
      setUserData(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md px-6 py-3 flex items-center justify-between">
  {/* Left side: Logo + Add Task */}
  <div className="flex items-center gap-6">
    {/* Home Logo */}
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => navigate("/home")}
    >
      <IoHome className="text-2xl text-blue-600" />
      <span className="text-xl font-semibold text-gray-700">TaskManager</span>
    </div>

    {/* Add Task Button */}
    <button
      className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
      onClick={() => navigate("/addtask")}
    >
      + Add Task
    </button>
  </div>

  {/* Account Menu */}
  <div className="relative">
    <button
      className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full text-blue-800 font-medium"
      onClick={() => setShowDropdown((prev) => !prev)}
    >
      <FaUserCircle className="text-lg" />
      Account
      <FaChevronDown className="text-xs" />
    </button>

    {showDropdown && (
      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border text-gray-700">
        <button
          className="w-full text-left px-4 py-2 hover:bg-gray-100"
          onClick={() => {
            setShowDropdown(false);
            navigate("/profile");
          }}
        >
          Profile
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-gray-100 border-t"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    )}
  </div>
</div>

  )
};

export default Navbar;
