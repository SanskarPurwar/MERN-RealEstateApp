import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    avatar :{
        type: String,
        default: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    wishlist:{
        type: Array,
        default: []
    },
    chatId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Chat'
    }]
}, {timestamps : true})

const User = mongoose.model("User" , userSchema);
export default User; 