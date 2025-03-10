import express from "express"
import {verifyOrganizer, verifyToken} from "../utils/AuthMiddleware.js";
import { CreateEvent } from "../controller/EventController.js";

const router = express.Router();

router.post("/", verifyToken, verifyOrganizer, CreateEvent) // Only organizer can create events
router.get("/")
router.get("/")
router.put("/")
router.delete("/")
router.post("/")

export default router;