import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes.js"
import userRoutes from "./routes/UserRoutes.js"
import eventRoutes from "./routes/EventRoutes.js"
import bookingRoutes from "./routes/BookingRoutes.js"
import organizerRoutes from "./routes/OrganizerRoutes.js"
import connectDB from "./db/database.js";
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json()); // this line allow json in backend
app.use(cors());
app.use(cookieParser());


connectDB()
.then(() => {
  app.listen(3000, (req, res, next) => {
    console.log("Server is running on port 3000 🚀");
  })
})
.catch((err) => {
  console.log("MONGOD DB connection failed !!!", err);
  
})

// Routes
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/event", eventRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/organizer", organizerRoutes)