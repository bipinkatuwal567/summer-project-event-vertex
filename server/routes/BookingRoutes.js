import express from 'express';
import { verifyToken } from '../utils/AuthMiddleware';
import { registerForEvent } from '../controller/BookingController';

const router = express.Router();

router.post('/register',verifyToken, registerForEvent);

export default router;