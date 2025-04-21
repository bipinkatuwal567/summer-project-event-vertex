import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  ticketType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  cancellationReason: {
    type: String,
    default: ""
  },
  paymentDetails:{
    transaction_code:{
      type:String,
      required:false
    },
    status:{
      type:String,
      required:false
    },
    total_amount:{
      type:String,
      required:false
    },
    transaction_uuid:{
      type:String,
      required:false
    },
    product_code:{
      type:String,
      required:false
    },
  },
}, {
  timestamps: true,
});

bookingSchema.index({ userId: 1, eventId: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
