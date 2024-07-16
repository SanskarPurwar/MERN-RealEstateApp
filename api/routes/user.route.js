import express from 'express'
import { deleteUser, updateUser, showListing, updateWishlist} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyuser.js';


const router = express.Router();

router.get('/test',(req,res)=>{
    res.send(
        "I am just checking buddy"
    )
})

router.post('/update/:id' ,verifyToken, updateUser);
router.delete('/delete/:id' ,verifyToken, deleteUser);
router.get('/listing/:userId' , verifyToken, showListing);
router.patch('/updateWishlist/:listingId/:userId' , verifyToken , updateWishlist);

export default router;