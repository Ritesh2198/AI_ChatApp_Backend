import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true,
    },
    receiverId : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
    },
    groupId : {
        type : mongoose.Schema.ObjectId,
        ref : "Group",
    },
    message : {
        type : String,
        required : true,
        trim : true,
    }
},{ timestamps: true });

export const Message = mongoose.model("Message",messageSchema);

