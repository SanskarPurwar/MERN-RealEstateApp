import express from 'express';
import { verifyToken } from '../utils/verifyuser.js';
import { createListing,deleteListing, updateListing,getListing } from '../controllers/listing.controller.js';

const router = express.Router();

router.post('/create' ,verifyToken, createListing);
router.delete('/delete/:id' , verifyToken, deleteListing);
router.patch('/updateListing/:id',verifyToken , updateListing);
router.get('/getListing/:id', verifyToken, getListing);
export default router;