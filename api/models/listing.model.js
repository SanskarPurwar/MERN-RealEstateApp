import mongoose from "mongoose";
const listingSchema = new mongoose.Schema({
    userRef:{
        type: String,
        required: true
    },
    title :{
        type: String,
        required : true,
    },
    description: {
        type: String,
        required : true,
    },

    streetAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },

    type:{
        type:String,
        required:true
    },
    furnished: {
        type: Boolean,
        required: true
    },
    bedrooms:{
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    selectedPerks : {
        type: Array,
        default: []
    },
    imageUrls: {
        type: Array,
        required: true
    },
    discount:{
        type: Boolean,
        required: true,
    },
    regularPrice:{
        type: Number,
        required: true
    },
    discountedPrice:{
        type: Number,
        required: true
    }

}, {timestamps: true})

const Listing = mongoose.model('Listing' , listingSchema);
export default  Listing;