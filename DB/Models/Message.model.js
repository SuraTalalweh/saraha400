import { Schema,model,Types, mongoose } from "mongoose";
// import mongoose, { Schema,model,Types} from 'mongoose ';
const MessageSchema=new Schema({
    message:{
        type:String,
        required:true,
    },
    receiverId:{
        type: Types.ObjectId , 
        ref : 'User',
        required:true,
    }
},{
    timestamps: true
});
const MessageModel=mongoose.models.Message|| model('Message',MessageSchema);//model?
export default MessageModel;