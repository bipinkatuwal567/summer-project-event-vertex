import express from "express";
import {verifyOrganizer, verifyToken} from "../utils/AuthMiddleware.js"
import { getEventTicketStats, getOrganizerStats } from "../controller/OrganizerController.js";

const router = express.Router();

router.get("/stats", verifyToken, verifyOrganizer, getOrganizerStats)
router.get("/:eventId/ticket-stats", verifyToken, getEventTicketStats);

export default router;