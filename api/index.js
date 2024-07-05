import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

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

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000 , ()=>{
    console.log(`Server is listening at http://localhost:3000`);
});

import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


app.use( (err, req, res, next )=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success : false,
        statusCode ,
        message,
    })
} )