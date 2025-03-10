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
    approved: {
      type: Boolean,
      default: false,
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
          required: true,
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
