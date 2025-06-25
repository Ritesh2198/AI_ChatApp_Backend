import { Group } from "../models/groupModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";


export const createGroup = async(req,res) => {
    try{
        const {name,members} = req.body;

        const creatorId = req.user.id;

        if(!name || !creatorId || !members){
            return res.status(401).json({
                success : false,
                message : "Some error occured",
            })
        }
        const groupMembers = [...members, creatorId];
        const groupAvatar = `https://robohash.org/${name}.png`;

        const group = await Group.create({
                                    name,
                                    creator : creatorId,
                                    members : groupMembers,
                                    avatar : groupAvatar,
                                })

        await User.updateMany(
            { _id: { $in: groupMembers } },   
            { $push: { groups: group._id } } 
        );

        return res.status(200).json({
            success : true,
            data : group,
            message : "Group created successfully",
        })
        

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Group can't be created right now. Please try after sometime"
        })
    }
}



export const addMember = async(req,res) => {
    try{
        const {userId,groupId} = req.body;

        if(!userId || !groupId){
            return res.status(400).json({
                success : false,
                message : "Some error occurred",
            })
        }

        const user = await User.findById(userId);
        const group = await Group.findById(groupId);

        if(!user){
            return res.status(400).json({
                success : false,
                message : "User doest not exist",
            })
        }

        if(!group){
            return res.status(400).json({
                success : false,
                message : "Group doest not exist",
            })
        }

        const creator = req.user.id;

        if(creator !== group.creator){
            return res.status(400).json({
                success : false,
                message : "Only creator can add member",
            })
        }
        
        const existingUser = await Group.findOne({
            _id: groupId,
            members: { $in: [userId] } 
            })

        if(existingUser){
            return res.status(400).json({
                success : false,
                message : "User is already a member of this group",
            })
        }

        const updatedGroup = await Group.findByIdAndUpdate(
                                                groupId,
                                                {
                                                    $push : {
                                                        members : userId,
                                                    },
                                                },{new : true},
                                            ).populate("members").exec();

        const updatedUser = await User.findByIdAndUpdate(
                                                userId,
                                                {
                                                    $push : {
                                                        groups : groupId,
                                                    }
                                                },{new:true},
                                            ).populate("groups").exec();

        return res.status(200).json({
            success : true,
            data : updatedGroup,
            message : "Member added successfully",
        })


    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Member can't be added right now. Please try after sometime"
        })
    }
}



export const removeMember = async(req,res) => {
    try{
        const {userId,groupId} = req.body;

        if(!userId || !groupId){
            return res.status(400).json({
                success : false,
                message : "Some error occurred",
            })
        }

        const user = await User.findById(userId);
        const group = await Group.findById(groupId);

        if(!user){
            return res.status(400).json({
                success : false,
                message : "User doest not exist",
            })
        }

        if(!group){
            return res.status(400).json({
                success : false,
                message : "Group doest not exist",
            })
        }

        const creator = req.user.id;

        if(creator !== group.creator){
            return res.status(400).json({
                success : false,
                message : "Only creator can remove member",
            })
        }

        

        const existingUser = await Group.findOne({
                                        _id: groupId,
                                        members: { $in: [userId] } 
                                        })
        
        if(!existingUser){
            return res.status(400).json({
                success : false,
                message : "User is not a member of this group",
            })
        }
        const updatedGroup = await Group.findByIdAndUpdate(
                                                groupId,
                                                {
                                                    $pull : {
                                                        members : userId,
                                                    },
                                                },{new : true},
                                            ).populate("members").exec();

        const updatedUser = await User.findByIdAndUpdate(
                                                userId,
                                                {
                                                    $pull : {
                                                        groups : groupId,
                                                    }
                                                },{new:true},
                                            ).populate("groups").exec();

        return res.status(200).json({
            success : true,
            data : updatedGroup,
            message : "Member added successfully",
        })


    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Member can't be added right now. Please try after sometime"
        })
    }
}

export const getAllGroupMessages = async(req,res) => {
    try{
        const {groupId} = req.body;

        if(!groupId){
            return res.status(400).json({
        
            success : false,
            message : "GroupId doest not exist",
                
            })
        }

        const group = await Group.findById(groupId);

        if(!group){
            return res.status(400).json({
                success : false,
                message : "Group doest not exist",
            })
        }

        const messages = await Message.find(
                                        {groupId : groupId}
                                    ).populate("senderId receiverId", "name image")
                                    .sort({ createdAt: 1 });

        return res.status(200).json({
            success : true,
            data : messages,
            message : "Messages fetched successfully",
        })
    } catch (error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Can't get messages. Please try after sometime"
        })
    }
}


export const deleteGroup = async(req,res) => {
    try{
        const {groupId} = req.body;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        await User.updateMany(
            { _id: { $in: group.members } },  
            { $pull: { groups: groupId } }  
        );

        await Message.deleteMany({ groupId : groupId });

        await Group.findByIdAndDelete(groupId);
        return res.status(200).json({
            success : true,
            message : "Group deleted successfully",
        })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Group cannot be deleted right now. Please try after sometime"
        })
    }
}

export const getAllGroups = async(req,res) => {
    try{
        const userId = req.user.id;

        if(!userId){
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        const userGroups = await Group.find({ members: userId }); 


        return res.status(200).json({
            success : true,
            data : userGroups,
            message : "Groups fetched successfully",
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Group cannot be fetched right now. Please try after sometime"
        })
    }
}