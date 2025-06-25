import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dbConnection from "./config/database.js";
import { sendMessage } from "./controllers/MessageController.js";
import { Message } from "./models/messageModel.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

dbConnection();



app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/group", groupRoutes);
app.use("/api/v1/friend", friendRoutes);
app.use("/api/v1/message", messageRoutes);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
app.use(cors({ 
    origin: "http://localhost:5173",  
    credentials: true
}));


io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat: ${chatId}`);
    });

    socket.on("send_message", async (data) => {
        try {
            const { senderId, receiverId, groupId, message } = data;

            if (!message || !senderId) return;

            
            const newMessage = new Message({
                senderId,
                receiverId,
                groupId,
                message,
                createdAt: new Date()
            });
            await newMessage.save();
            
            const populatedMessage = await Message.findById(newMessage._id).populate(
                "senderId",
                "name image"
            );
            
            const chatRoom = groupId ? groupId : [senderId, receiverId].sort().join("-");
            console.log("Emitting message to room:", chatRoom, populatedMessage)
            
            io.to(chatRoom).emit("receive_message", populatedMessage,populatedMessage.receiverId,populatedMessage.groupId);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

