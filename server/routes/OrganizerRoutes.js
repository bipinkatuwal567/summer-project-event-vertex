import express from "express";
import {verifyOrganizer, verifyToken} from "../utils/AuthMiddleware.js"
import { getOrganizerStats } from "../controller/OrganizerController.js";

const router = express.Router();

router.get("/stats", verifyToken, verifyOrganizer, getOrganizerStats)

export default router;