// context/UserContext.jsx
import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // 🔁 Add loading flag

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/currentuser`, {
        withCredentials: true,
      });
      setUserData(result.data.user);
    } catch (error) {
      setUserData(null); // Ensure it's null if not authenticated
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = { userData, setUserData, serverUrl, loading };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
