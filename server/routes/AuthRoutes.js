import express from "express";
import { Login, SignUp } from "../controller/AuthController.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", Login);
router.post("/google");
router.get("/signout");

export default router;
