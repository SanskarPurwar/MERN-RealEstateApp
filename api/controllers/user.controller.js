import User from "../models/user.model.js";
import { errorHandler } from "../utils/errors.js"
import bcryptjs from 'bcryptjs';
import Listing from '../models/listing.model.js';

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'Invalid User'));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(password, 10);
        }

        // const user = await User.findOne({$or:[req.body.username , req.body.email]});
        // if(user){
        //     throw new Error('User already exists');
        // }        

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true })
        const { password, ...data } = updatedUser._doc;
        console.log('data is', data);

        res.status(200).json(data);

    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthorised request'));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User deleted Successfully');
    } catch (error) {
        next(error)
    }
}

export const showListing = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.userId) {
            return next(errorHandler(401, 'User not verified'))
        }
        try {
            const listing = await Listing.find({ userRef: req.params.userId });
            res.status(200).json(listing);
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(errorHandler(401, "Unauthorised Request"));
    }
}

export const updateWishlist = async (req, res, next) => {
    if (req.params.userId !== req.user.id) {
        return next(errorHandler(404), 'Unauthorised Request');
    }
    try {
        const listingId = req.params.listingId;
        const userId = req.params.userId
        const user = await User.findById(userId)
        if (!user) {
            return next(errorHandler(404, 'User Not Fount'));
        }
        const index = user.wishlist.indexOf(listingId);
        if (index !== -1) {
            user.wishlist.splice(index, 1);
        } else {
            user.wishlist.push(listingId);
        }
        await user.save();
        console.log(user);
        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
}