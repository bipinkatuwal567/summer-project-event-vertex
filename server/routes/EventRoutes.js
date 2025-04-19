import express from "express"
import {verifyOrganizer, verifyToken} from "../utils/AuthMiddleware.js";
import { CreateEvent, GetEvents } from "../controller/EventController.js";

const router = express.Router();

router.post("/", verifyToken, verifyOrganizer, CreateEvent) // Only organizer can create events
router.get("/", GetEvents)
router.get("/")
router.put("/")
router.delete("/")
router.post("/")

export default router;