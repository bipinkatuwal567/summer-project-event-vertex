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

// Routes
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/event", eventRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/organizer", organizerRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : null
  });
});

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

connectDB()
.then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
  })
})
.catch((err) => {
  console.log("MONGODB connection failed!!!", err);
app.use("/api/organizer", organizerRoutes)
})