import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/errors.js";


export const createListing = async (req , res , next)=>{
    try {
        const listing = await  Listing.create(req.body);
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
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

export const filterListings = async (req,res,next)=>{
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let discount = req.query.discount;
        
        if(discount === undefined || discount === 'false'){
            discount = {$in: [true, false]};
        }
        let furnished = req.query.furnished;
        if(furnished === undefined || furnished === 'false'){
            furnished = {$in : [false , true]};
        }
        let type = req.query.type;
        if(type === 'all' || type === undefined){
            type = {$in:['sell' , 'rent']};
        }   
        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice = parseInt(req.query.maxPrice) || Infinity;

        const search = req.query.searchData || '';
        const sort = req.query.sort || 'createdAt'; 
        const order = req.query.order || 'desc';


        // reviews to be added
        // const reviews  
        const filterLists = await Listing.find({
            title: {$regex : search , $options: 'i'},
            furnished,
            type,
            regularPrice : { $gte:minPrice , $lte:maxPrice},
            discount
        }).sort({[sort] : order})
          .limit(limit)
          .skip(startIndex);
        
        res.status(200).json(filterLists);
    } catch (error) {
        next(`error is,${error.message}`);
    }
}