import { Message } from "../models/messageModel.js";
import {Group} from "../models/groupModel.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export const sendMessage = async(req,res) => {
    try{
        const {receiverId,groupId,message} = req.body;
        const senderId = req.user.id;

        if(!senderId || !message || (!receiverId && !groupId)){
            return res.status(400).json({
                success: false,
                message: "Some error occured",
            });
        }

        const newMessage = await Message.create({senderId,receiverId,groupId,message});

        if (groupId) {
            await Group.findByIdAndUpdate(groupId, {
                $push: { messages: newMessage._id }
            });
        }

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage,
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Can't send message right now. Please try after sometime"
        })
    }
}


export const getMessages = async(req,res) => {
    try{
        const {receiverId} = req.body;
        const senderId = req.user.id;

        if(!receiverId || !senderId){
            return res.status(400).json({
                success: false,
                message: "Some error occured",
            });
        }

        
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })
        .populate("senderId receiverId")
        .sort({ createdAt: 1 });

        return res.status(200).json({
            success : true,
            data : messages,
            message : "Messages fetched successfully"
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Can't fetch messages right now. Please try after sometime"
        })
    }
}



export const summarizeChat = async(req,res)=>{
    try {
        console.log("GEMINI_API_KEY:",process.env.GEMINI_API_KEY);
        const { chatMessages } = req.body;
        const chatMessage = chatMessages
            .map((msg) => `${msg.senderId?.name || "Unknown"}: ${msg.message}`);

        console.log("Formatted Messages Array:", chatMessage);

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: `Summarize this chat: ${chatMessage.join(" ")}` }] }]
            }
        )
        console.log("RESPONSE",response.data);
        return res.status(200).json({
            success:true,
            data:response.data,
        })
    } catch (error) {
        console.error("Error summarizing chat:", error);
        res.status(500).json({ error: "Failed to summarize" });
    }
}