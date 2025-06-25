import express from "express";
import { auth } from "../middlewares/auth.js";
import { acceptFriendRequest, getAllFriends, getAllRequests, getAllSentRequests, getRandomUsers, rejectFriendRequest, sendFriendRequest } from "../controllers/RequestController.js";

const router = express.Router();


router.post("/send-request",auth,sendFriendRequest);
router.post("/accept-request",auth,acceptFriendRequest);
router.post("/reject-request",auth,rejectFriendRequest);
router.get("/get-all-friends",auth,getAllFriends);
router.get("/get-all-requests",auth,getAllRequests);
router.get("/get-all-sent-requests",auth,getAllSentRequests);
router.get("/get-random-users",auth,getRandomUsers);

export default router;