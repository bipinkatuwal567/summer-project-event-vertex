import express from "express";
import { SignUp } from "../controller/AuthController.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin");
router.post("/google");
router.get("/signout");

export default router;
