import MessageModel from "../../../../DB/Models/Message.model.js";
import userModel from "../../../../DB/Models/User.model.js";


export const getMessages=async(req,res)=>{
    const messageList=await MessageModel.find({receiverId:req.user._id});
    return res.json({message:"messages",messageList});
}
export const sendMessage=async(req,res)=>{
    const {receiverId}=req.params;
    const {message}=req.body;
    const user=await userModel.findById(receiverId);
    if(!user){
        return res.status(404).json({message:"user not found"});
    }
    const createMessage=await MessageModel.create({message,receiverId})
    return res.status(201).json({message:"success"});
    
}