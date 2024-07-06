import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/errors.js";


export const createListing = async (req , res , next)=>{
    try {
        const listing = await  Listing.create(req.body);
        console.log("Here is listing ",listing);
        res.status(201).json(listing);
    } catch (error) {
        console.log('error is here',error);
        next(error);
    }
}

export const deleteListing = async (req, res , next)=>{
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404, 'Not found'));
        }
        if(req.user.id !== listing.userRef.toString()){
            return next(errorHandler(401, 'Unauthorized Request'));
        }
        try {
            await Listing.findByIdAndDelete(req.params.id);
            res.status(200).json('Listing Deleted Successfully');
        } catch (error) {
            next(error);
        }

    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req,res, next)=>{
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404, 'Listing Not Found'));
        } 
        if(req.user.id !== listing.userRef){
            return next(errorHandler(401,'Unauthorised Request'));
        }
        try {
            const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new:true});
            if(!updatedListing){
                return next(errorHandler(500, 'Internal Error'));
            }
            res.status(200).json(updatedListing);
        } catch (error) {
            next(error);
        }

    } catch (error) {
        next(error);
    }
}

export const getListing = async (req,res,next)=>{
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404, 'Listing Not Found'));
        }
        if(req.user.id !== listing.userRef){
            return next(errorHandler(401, "Unauthorised Request hai"));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}