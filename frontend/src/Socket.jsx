// src/socket.js
import { useContext } from "react";
import { io } from "socket.io-client";
import { UserDataContext } from "./context/UserContext";
 

const socket = io("http://localhost:8000", {
  withCredentials: true,
});

export default socket; 
