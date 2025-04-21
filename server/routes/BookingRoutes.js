import express from 'express';
import { verifyToken } from '../utils/AuthMiddleware.js';
import { getMyBookings, registerForEvent } from '../controller/BookingController.js';

const router = express.Router();

router.post('/register',verifyToken, registerForEvent);
router.get("/my", verifyToken, getMyBookings)

export default router;