import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Technology", "Music", "Business", "Sport", "Other"],
      required: true,
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    banner: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean, 
      default: false
    },
    tickets: [
      {
        type: {
          type: String,
          enum: ["VIP", "General", "Free"],
          required: true,
        },
        price: {
          type: Number,
          required: function () {
            return this.type !== "Free";
          }, // Price required for VIP & General
          default: 0,
        },
        availableSeats: {
          type: Number,
          required: function () {
            return this.type !== "Free";
          },
          // For Free tickets, availableSeats is optional, but if provided, must be >= 0
          validate: {
            validator: function (v) {
              if (this.type === "Free") return v === undefined || v >= 0;
              return v !== undefined && v >= 0;
            },
            message: 'Available seats must be a non-negative number.'
          },
        },
      },
    ],
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track registered users
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Canceled"],
      default: "Upcoming",
    },
  },
  { timestamps: true } // ✅ Fix: lowercase timestamps
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
