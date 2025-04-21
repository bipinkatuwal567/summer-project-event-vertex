import express from "express"
import {verifyOrganizer, verifyToken} from "../utils/AuthMiddleware.js";
import { CreateEvent, GetEventById, GetEvents, GetEventsByOrganizer, SoftDeleteEvent } from "../controller/EventController.js";

const router = express.Router();

router.post("/", verifyToken, verifyOrganizer, CreateEvent) // Only organizer can create events
router.get("/", GetEvents)
router.get("/organizer", verifyToken, GetEventsByOrganizer)
router.get("/:id", GetEventById)
router.put("/")
router.delete("/:id", verifyToken, SoftDeleteEvent)
router.post("/")

export default router;