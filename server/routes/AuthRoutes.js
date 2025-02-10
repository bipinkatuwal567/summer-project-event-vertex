import express from "express";
import { Login, Signout, SignUp } from "../controller/AuthController.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", Login);
router.post("/google");
router.get("/signout", Signout);

export default router;
