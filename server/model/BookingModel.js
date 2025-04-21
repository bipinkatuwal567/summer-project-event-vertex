import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      ticketType: {
        type: String,
        enum: ["VIP", "General", "Free"],
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      paymentStatus: {
        type: String,
        enum: ["Paid", "Pending", "Failed"],
        default: "Pending",
      },
      paymentDetails: {
        method: String, // e.g., "eSewa"
        transactionId: String,
        paidAt: Date,
      },
      status: {
        type: String,
        enum: ["Confirmed", "Canceled", "Expired"],
        default: "Confirmed",
      },
    },
    { timestamps: true }
  );
  

bookingSchema.index({ userId: 1, eventId: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
