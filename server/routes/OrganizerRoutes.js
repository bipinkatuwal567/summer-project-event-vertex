import express from "express";
import {verifyOrganizer, verifyToken} from "../utils/AuthMiddleware"

const router = express.Router();

router.get("stats", verifyToken, verifyOrganizer)

export default router;