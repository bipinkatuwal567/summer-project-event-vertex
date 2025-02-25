import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, 
  }, 
  banner: {
    type: String, 
    default: ""
  }, 
  isPublished: {
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
            default: 0, 
        }, 
        availableSeats: {
            type: Number, 
            required: true, 
        }
    }
  ]
}, {
    Timestamps: true
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
