import mongoose from "mongoose"

const groupSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },
    creator : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true,
    },
    profilePic: { 
        type: String,
        default: "default.png"
        },
    members : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User",
        },
    ],
    messages : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Message",
        }
    ],
    avatar: {
        type: String,
    },
},{ timestamps: true });

export const Group = mongoose.model("Group",groupSchema);