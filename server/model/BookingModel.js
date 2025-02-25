import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId, ref: "User", required: true, 
    }, 
    eventId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Event", 
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
    totalPrice: {
        type: Number, 
        required: true, 
    }, 
    paymentStaute: {
        type: String, 
        enum: [
            "Pending", 
            "Paid", 
        ], 
        default: "Pending", 
    }
}, {
    Timestamp: true, 
})

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;