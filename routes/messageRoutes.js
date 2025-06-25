import express from "express";
import { auth } from "../middlewares/auth.js";
import { getMessages, sendMessage, summarizeChat } from "../controllers/MessageController.js";

const router = express.Router();

router.post("/send-message",auth,sendMessage);
router.post("/get-messages",auth,getMessages);
router.post("/summarize",auth,summarizeChat);


// const GEMINI_API_KEY = "AIzaSyDvvoDMffWtIe6oILw46r71iBNTAj363AU";

// router.post("/summarize", auth,async (req, res) => {
//     try {
//         console.log("GEMINI_API_KEY:", GEMINI_API_KEY);
//         const { chatMessages } = req.body;
//         const chatMessage = chatMessages
//             .map((msg) => `${msg.senderId?.name || "Unknown"}: ${msg.message}`); // Ensure it's an array

//         console.log("Formatted Messages Array:", chatMessage); // Debugging

//         const response = await axios.post(
//             `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
//             // `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
//             {
//                 contents: [{ parts: [{ text: `Summarize this chat: ${chatMessage.join(" ")}` }] }]
//             }
//         )
//         console.log("RESPONSE",response.data);
//         return res.status(200).json({
//             success:true,
//             data:response.data,
//         })
//     } catch (error) {
//         console.error("Error summarizing chat:", error);
//         res.status(500).json({ error: "Failed to summarize" });
//     }
// });


export default router