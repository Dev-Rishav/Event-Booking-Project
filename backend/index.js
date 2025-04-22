import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/authRoutes.js";
import otherRouter from "./routes/otherRoutes.js";
import http from 'http';
import { Server } from 'socket.io';

dotenv.config({});
const app = express();

const PORT = 8080;

// default middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Store connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
    // console.log('User connected:', socket.id);

    // Store user ID or email for targeted notifications
    socket.on('register', (userId) => {
        connectedUsers.set(userId, socket.id);
        // console.log(`${userId} registered with socket ID: ${socket.id}`);
    });

    socket.on('disconnect', () => {
        // console.log('User disconnected:', socket.id);
        for (let [userId, id] of connectedUsers.entries()) {
            if (id === socket.id) connectedUsers.delete(userId);
        }
    });
});



app.use("/user", userRouter);
app.use("/api", otherRouter);

export { io , connectedUsers};

app.get('/', (req, res) => {
    return res.json({ msg: "hello , i am BTS" });
})

server.listen(PORT, () => {
    console.log(`Server is listening at PORT ${PORT}`);
})


