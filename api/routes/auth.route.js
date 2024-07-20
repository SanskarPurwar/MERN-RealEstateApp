import express from 'express'
import { signIn, signInWithGoogle, signOut, signUp, checkAuth} from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyuser.js';

const router = express.Router();
router.post('/sign-up', signUp );
router.post('/sign-in' , signIn);
router.post('/google' , signInWithGoogle);
router.get('/sign-out', signOut);
router.get('/checkAuth/:userId', verifyToken, checkAuth)

export default router;