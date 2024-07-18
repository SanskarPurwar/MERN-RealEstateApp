import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URL)
        console.log(`\n MongoDB connected !! DB host : ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.error('Error is: ', error);
        process.exit(1);
    }
}

connectDB()
.then(()=>{
        console.log(`DB connected`);
    }).catch((err)=>{
        console.log(err);
    })

const __dirname = path.resolve();


import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server , {
    cors:{
        origin :"*",
    },
});

io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });
  
    socket.on('sendMessage', async (message) => {
      try {
        const newMessage = await Message.create(message);
        await Chat.findByIdAndUpdate(message.chatId, {
          $push: { messages: newMessage._id },
          $set: { lastMessage: message.message },
        });
  
        io.to(message.chatId).emit('receiveMessage', newMessage);
      } catch (error) {
        console.error(error);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
  

app.use(express.json());
app.use(cookieParser());


server.listen(3000 , ()=>{
    console.log(`Server is listening at http://localhost:3000`);
});

import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import chatRouter from './routes/chat.route.js'
import Message from './models/message.model.js';
import Chat from './models/chat.model.js';

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/chats', chatRouter);

app.use(express.static(path.join(__dirname, '/client/dist')))
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname , 'client', 'dist' , 'index.html'));
})


app.use( (err, req, res, next )=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success : false,
        statusCode ,
        message,
    })
} )