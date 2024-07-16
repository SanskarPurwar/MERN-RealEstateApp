import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat',
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
}, {required:true});

const Message = mongoose.model('Message' , messageSchema);
export default Message;