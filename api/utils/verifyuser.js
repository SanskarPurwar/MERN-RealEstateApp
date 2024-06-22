import { errorHandler } from "./errors.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next)=>{
    const token = req.cookies.access_token;
    if(!token){
        return next(errorHandler(401 , 'User is not verified ...Unauthorized request'))
    }
    jwt.verify(token , process.env.JWT_SECRET, (err, user)=>{
        if(err) return next(errorHandler(403, 'forbidden'));
        req.user = user;
    })
    next();
}