import express from "express";
import { auth } from "../middlewares/auth.js";
import { getMessages, sendMessage, summarizeChat } from "../controllers/MessageController.js";

const router = express.Router();

router.post("/send-message",auth,sendMessage);
router.post("/get-messages",auth,getMessages);
router.post("/summarize",auth,summarizeChat);

export default router