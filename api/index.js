import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URL)
        console.log(`\n MongoDB connected !! DB host : ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.error('Error: ', error);
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

app.listen(3000 , ()=>{
    console.log(`Server is listening at http://localhost:3000`);
});