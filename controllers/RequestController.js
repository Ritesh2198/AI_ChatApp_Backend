import { FriendRequests } from "../models/friendModel.js";
import {User} from "../models/userModel.js"

export const sendFriendRequest = async(req,res) => {
    try{
        const {receiverId} = req.body;
        const senderId = req.user.id;
        if(!senderId || !receiverId){
            return res.status(400).json({
                success : false,
                message : "Some error occured",
            })
        }

        const existingRequest = await FriendRequests.findOne({sender : senderId,receiver : receiverId});

        if(existingRequest){
            return res.status(400).json({
                success : false,
                message : "Request already sent"
            })
        }

        const request = await FriendRequests.create({
                                            sender : senderId,
                                            receiver : receiverId,
                                        })

        return res.status(200).json({
            success : true,
            data : request,
            message : "Friend request sent successfully",
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Request can't be sent right now. Please try after sometime"
        })
    }
}


export const acceptFriendRequest = async(req,res) => {
    try{
        const {senderId} = req.body;
        const receiverId = req.user.id;
        console.log("SENDER",senderId);
        console.log("Receiver",receiverId);
        if(!senderId || !receiverId){
            return res.status(400).json({
                success : false,
                message : "Some error occured",
            })
        }


        await FriendRequests.findOneAndUpdate(
                                        {sender:senderId,receiver : receiverId,status:'pending'},
                                        {status : 'accepted'},
                                    )

        return res.status(200).json({
            success : true,
            message : "Friend request accepted",
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Request can't be accepted right now. Please try after sometime"
        })
    }
}


export const rejectFriendRequest = async(req,res) => {
    try{
        const {senderId} = req.body;
        const receiverId = req.user.id;
        if(!senderId || !receiverId){
            return res.status(400).json({
                success : false,
                message : "Some error occured",
            })
        }


        await FriendRequests.findOneAndDelete(
                                        {sender:senderId,receiver : receiverId,status:'pending'},
                                    )

        return res.status(200).json({
            success : true,
            message : "Friend request rejected",
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Request can't be rejected right now. Please try after sometime"
        })
    }
}


export const getAllFriends  = async(req,res) => {
    try{
        const userId = req.user.id;

        if(!userId){
            return res.status(400).json({
                success : false,
                message : "Some error occured",
            })
        }

        const friends = await FriendRequests.find({
            $or: [
                { sender: userId, status: "accepted" },
                { receiver: userId, status: "accepted" }
            ]
        }).populate("receiver sender");
        

        const friendList = friends.map(friend => {
            return friend.sender._id.toString() === userId ? friend.receiver : friend.sender;
        });

        return res.status(200).json({
            success : true,
            data : friendList,
            message : "Friends fetched successfully",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Can't fetch friends right now. Please try after sometime"
        })
    }
}


export const getAllRequests  = async(req,res) => {
    try{
        const userId = req.user.id;

        if(!userId){
            return res.status(400).json({
                success : false,
                message : "Some error occured",
            })
        }

        const receivedRequests = await FriendRequests.find({ receiver: userId, status: "pending" }).populate("sender");


        return res.status(200).json({
            success : true,
            data : receivedRequests,
            message : "Request fetched successfully",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Can't fetch requests right now. Please try after sometime"
        })
    }
}


export const getAllSentRequests  = async(req,res) => {
    try{
        const userId = req.user.id;

        if(!userId){
            return res.status(400).json({
                success : false,
                message : "Some error occured",
            })
        }

        const sentRequests = await FriendRequests.find({ sender: userId, status: "pending" }).populate("receiver");


        return res.status(200).json({
            success : true,
            data : sentRequests,
            message : "Sent Request fetched successfully",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Can't fetch sent requests right now. Please try after sometime"
        })
    }
}


export const getRandomUsers = async (req,res) => {
    try {
        const userId = req.user.id;
        
        console.log(userId,"USER");
        
        const users = await User.find({ _id: { $ne: userId } });

        
        const sentFriendRequests = await FriendRequests.find({
            sender: userId,
            status: {$in: ["pending", "accepted"]},
        }).select("receiver");

        
        const sentRequestIds = sentFriendRequests.map((request) => request.receiver.toString());

        const randomUsers = users.filter(
            (user) => !sentRequestIds.includes(user._id.toString())
        );

        return res.status(200).json({
            success: true,
            data: randomUsers,
            message: "Users fetched successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Some error occurred while fetching users. Please try after sometime",
        });
    }
};