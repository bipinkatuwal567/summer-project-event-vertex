import express from "express";
import { GoogleLogin, Login, Signout, SignUp } from "../controller/AuthController.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", Login);
router.post("/google", GoogleLogin);
router.get("/signout", Signout);

export default router;
