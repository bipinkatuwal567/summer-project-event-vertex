import express from "express"
import { verifyOrganizer, verifyToken } from "../utils/AuthMiddleware.js";
import { CreateEvent, getBookingsForEvent, GetEventById, GetEvents, GetEventsByOrganizer, SoftDeleteEvent, UpdateEvent } from "../controller/EventController.js";

const router = express.Router();

router.post("/", verifyToken, verifyOrganizer, CreateEvent) // Only organizer can create events
router.get("/", GetEvents)
router.get("/organizer", verifyToken, GetEventsByOrganizer)
router.get("/:id", GetEventById)
router.put("/:id", verifyToken, verifyOrganizer, UpdateEvent)
router.delete("/:id", verifyToken, SoftDeleteEvent)
router.get("/events/:eventId/bookings", verifyToken, getBookingsForEvent);

export default router;