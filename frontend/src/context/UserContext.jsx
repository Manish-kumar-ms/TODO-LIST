

import { create, useEffect } from 'react';
import React, { useState } from 'react'
import { createContext } from 'react';
import axios from 'axios';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {

    const serverUrl = "http://localhost:8000"
    const [userData, setUserData] = useState(null);


    const handleCurrentUser = async () => {
        try {
            const result=await axios.get(`${serverUrl}/api/auth/currentuser`,{withCredentials: true});
            setUserData(result.data.user);
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        handleCurrentUser();
    }, []);
   

    const value = { userData, setUserData, serverUrl };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  )
}

export default UserContext