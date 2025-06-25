import express from "express";
import { auth } from "../middlewares/auth.js";
import { addMember, createGroup, deleteGroup, getAllGroupMessages, getAllGroups, removeMember } from "../controllers/GroupController.js";


const router = express.Router();


router.post("/create-group",auth,createGroup);
router.post("/add-member",auth,addMember);
router.post("/remove-member",auth,removeMember);
router.post("/get-all-group-messages",auth,getAllGroupMessages);
router.post("/delete-group",auth,deleteGroup);
router.get("/get-all-groups",auth,getAllGroups);

export default router;