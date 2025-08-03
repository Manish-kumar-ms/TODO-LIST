import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './Routes/AuthRouter.js';
import connectDB from './config/db.js';
import { ensureAuthenticated } from './Middlewares/Auth.js';
import taskRouter from './Routes/TaskRoutes.js';
import cookieParser from 'cookie-parser';
import http from 'http';                       // 👈 NEW
import { Server } from 'socket.io';   
import { setupSocketConnection } from './socket.js';



const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080

//  Setup HTTP server and wrap Express with it
const server = http.createServer(app);

//  Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: 'https://todo-list-frontend-z1sd.onrender.com',
    credentials: true,
  },
});

//  Global access to io
global.io = io;

//  Setup socket connection handling
setupSocketConnection(io);

app.get('/',(req,res)=>{
    res.send('Hello World');
});

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'https://todo-list-frontend-z1sd.onrender.com',
    credentials: true
}));

app.use('/api/auth', authRouter);
app.use("/api/tasks",  taskRouter)

// ✅ Start HTTP Server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  connectDB();
});
