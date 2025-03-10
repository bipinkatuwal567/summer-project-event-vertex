import express from "express"
import { UpdateUser } from "../controller/UserController.js";
import {verifyToken} from "../utils/AuthMiddleware.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, UpdateUser)

export default router;