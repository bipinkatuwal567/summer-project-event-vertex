import express from 'express';
import { verifyToken } from '../utils/AuthMiddleware.js';
import { registerForEvent } from '../controller/BookingController.js';

const router = express.Router();

router.post('/register',verifyToken, registerForEvent);

export default router;