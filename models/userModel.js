import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim : true,
    },
    email:{
        type : String,
        required: true,
        trim : true,
    },
    password:{
        type : String,
        required : true,
    },
    // friends:[
    //     {
    //         type : mongoose.Schema.ObjectId,
    //         ref : "User",
    //     }
    // ],

    groups : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Group",
        }
    ],

    role:{
        type : String,
        enum : ["Admin" , "User"],
        default : "User",
        required : true,

    },
    token: {
        type: String,
    },

    image: {
        type: String,
    },


},{ timestamps: true });

export const User = mongoose.model("User",userSchema);