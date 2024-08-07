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

        const token = jwt.sign({id:user._id} ,process.env.JWT_SECRET)
        res.cookie('access_token', token , {httpOnly:true })
        .status(200)
        .json(loggedInUser) ;
        
    } catch (error) {
        next(error);
    }
    
}

export const signInWithGoogle = async (req, res, next)=>{
    const { name : username , email, photo } = req.body;
    try {
        const user = await User.findOne({email});
        console.log('user', user);
        if(user){
            const token = jwt.sign({id:user._id} ,process.env.JWT_SECRET);
            const {password: pass, ...rest} = user._doc;
            res.cookie('access_token', token , {httpOnly:true})
            .status(200)
            .json(rest) ;
        }
        else{
            const generatePassword = Math.random().toString(36).slice(-8); 
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            const newUser = new User({username : username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), 
                                        email , password: hashedPassword, avatar: photo});
            await newUser.save();
            const token = jwt.sign({id: newUser._id} , process.env.JWT_SECRET);
            const {password: pass, ...rest} = newUser._doc;
            res.cookie('access_token' , token ,{httpOnly:true })
                .status(200)
                .json(rest);
        }

    } catch (error) {
        next(error);
    }
}

export const updateProfileAvatar = async (req, res, next)=>{
    const {username , avatar} = req.body;
    const updateAvatar = await User.updateOne({username} , {avatar} );
    
    if(!updateAvatar){
        next(500, 'Internal Error');
        return;
    }
    res.status(200).send('User Avatar Updated');

}

export const signOut = async (req , res , next)=>{
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
      } catch (error) {
        next(error);
      }
}

export const checkAuth = async (req, res, next)=>{
    const userId = req.params.userId;
    if(req.user._id !== userId){
        next(errorHandler(401, 'User not verified'));
        return;
    }
    res.status(200).json('user Verified');
}