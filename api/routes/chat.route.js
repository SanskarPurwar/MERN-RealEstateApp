import express from 'express';
import { verifyToken } from '../utils/verifyuser.js';
import {createChat, getChatArray, sendMessage, showConversation} from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/createChat/:userId1/:userId2', verifyToken, createChat);
router.get('/getChatArray', verifyToken, getChatArray);
router.post('/sendMessage/:chatId/:userId', verifyToken, sendMessage);
router.get('/showConversation/:chatId', verifyToken, showConversation);

export default router;