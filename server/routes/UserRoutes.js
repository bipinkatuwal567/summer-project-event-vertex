import express from "express"
import { UpdateUser } from "../controller/UserController.js";

const router = express.Router();

router.post("/upload", UpdateUser)

export default router;