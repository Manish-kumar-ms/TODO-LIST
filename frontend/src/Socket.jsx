// src/socket.js
import { useContext } from "react";
import { io } from "socket.io-client";

 

const socket = io("https://todo-list-pe1w.onrender.com", {
  withCredentials: true,
});

export default socket; 
