import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }],
    lastMessage: {
        type: String,
    },

}, {timestamps: true});

const Chat = mongoose.model('chat' , chatSchema);
export default Chat;
