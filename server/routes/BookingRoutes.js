import express from 'express';
import { verifyToken } from '../utils/AuthMiddleware.js';
import { getMyBookings, registerForEvent, getBookingById } from '../controller/BookingController.js';

const router = express.Router();

router.post('/register',verifyToken, registerForEvent);
router.get("/my", verifyToken, getMyBookings)
// GET booking by ID (for polling status)
router.get('/:id', getBookingById);

export default router;