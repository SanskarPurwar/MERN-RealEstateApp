import express from 'express'
import { signIn, signInWithGoogle, signOut, signUp} from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/sign-up', signUp );
router.post('/sign-in' , signIn);
router.post('/google' , signInWithGoogle);
router.get('/sign-out', signOut);

export default router;