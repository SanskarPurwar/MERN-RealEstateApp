import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/errors.js";
import jwt from "jsonwebtoken";

export const signUp = async (req , res, next)=>{
    const {username , email, password} = req.body;
    if([username , email , password].some( (item)=> item?.trim() === undefined) ){
        return next(errorHandler(400, 'All field are compulsory'));
    }
    try {
        const hashPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({username, email, password: hashPassword});
        await newUser.save();
        res.status(201).json('User Created successfully');
    } catch (error) {
        next(error);
    }
}

export const signIn = async (req, res ,next)=>{
    const {username , password , confirmPassword} = req.body;
    try {
        if([username , password, confirmPassword].some( (item)=>item?.trim() === '' ) ){
            return next(errorHandler(400, 'Fill all the details'));
        }

        if(password !== confirmPassword){
            return next(errorHandler(400, 'Invalid Credentials'));
        }

        const user = await User.findOne({$or : [{email : username} , {username: username}]});

        if(!user){
            return next(errorHandler(400, 'User Not Found'));
        }

        const isPasswordCorrect = bcryptjs.compareSync(password , user.password);

        if(!isPasswordCorrect){
            next(errorHandler(401, 'Invalid Credentials'));
        }
        const loggedInUser = await User.findOne({$or : [{email : username} , {username: username}]}).select("-password") ;

        if(!loggedInUser){
            return next(errorHandler(500, 'Internal Error while finally creating loggedInUser'));
        }

        const token = jwt.sign({it:user._id} ,process.env.JWT_SECRET)
        res.cookie('access_token', token , {httpOnly:true , expires: new Date(Date.now() + 24*60*60*100 )})
        .status(200)
        .json(loggedInUser) ;
        
    } catch (error) {
        next(error);
    }
    
}