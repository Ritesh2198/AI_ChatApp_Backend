import mongoose from "mongoose";

const friendRequestsSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true,
    },
    receiver : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true,
    },
    status : {
        type : String,
        enum : ['pending','rejected','accepted'],
        default : 'pending',
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
})

export const FriendRequests = mongoose.model("FriendRequests",friendRequestsSchema);