import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errors.js";

export const createChat = async (req, res, next)=>{
    const userId1 = req.body.currentUserId;
    const userId2 = req.body.receiverId;
    if(userId1 === userId2){
        next(errorHandler(401 , `Cann't chat yourSelf`))
        return;
    }

    const isPresent = await Chat.find({userIds: { $all : [userId1 , userId2]}}).populate('userIds', 'username avatar').populate("messages");
    if(isPresent.length > 0){
        res.status(200).json(isPresent);
        return;
    }
    try {
        const chat = await Chat.create({
            userIds:[userId1 , userId2],
        });
        if(!chat){
            return next(errorHandler(401, `Chat cann't be created`));
        }
        console.log(chat);
        const userA = await User.findByIdAndUpdate(userId1, {$push : {chatId:chat._id} });
        const userB = await User.findByIdAndUpdate(userId2, {$push : {chatId:chat._id} });
        console.log(userA , "       ", userB);

        res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500 , `Error creating chat ${error}`)
    }
}

export const getChatArray = async (req, res, next)=>{
    const userId = req.user.id;
    try {
        const userAllChats = await Chat.find({userIds:{ $in : [userId] }}).populate('userIds');
        if(!userAllChats){
            return next(errorHandler(401, 'error finding chats'));
        }
        res.status(200).json(userAllChats);
    } catch (error) {
        res.status(500 , `Error creating chat ${error}`)
    }
}

export const sendMessage = async (req, res, next)=>{
    const chatId = req.params.chatId;
    const message = req.body.message;
    const userId = req.params.userId;
    try {
        const newMessage = await Message.create({chatId , userId , message});
        await Chat.findByIdAndUpdate(chatId , {
            $push: {messages : newMessage._id},
            $set: {lastMessage: message},
        });
        res.status(200).json(newMessage);

    } catch (error) {
     res.status(500, `error creating message ${error}`);   
    }
}

export const showConversation = async (req, res, next)=>{
    const chatId = req.params.chatId;
    try {
        const allChats = await Chat.findById(chatId).populate({
            path:"messages",
            options:{
                sort:{createdAt : -1}
            }
        }).populate({
            path:"userIds",
            select: "username avatar",
        })
        ;
        if(!allChats){
            next(errorHandler(401, 'No conversation Found'));
            return ;
        } 

        res.status(200).json(allChats);

    } catch (error) {
        res.status(500).json(error.message);
    }
}


