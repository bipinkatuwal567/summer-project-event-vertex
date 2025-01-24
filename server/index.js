import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes.js"
import userRoutes from "./routes/UserRoutes.js"
import connectDB from "./db/database.js";

dotenv.config();

const app = express();
app.use(express.json()); // this line allow json in backend


connectDB();

// Routes
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)

app.listen(3000, (req, res, next) => {
  console.log("Server is running on port 3000 🚀");
})