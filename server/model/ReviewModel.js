import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
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
    rating: {
        type: Number, 
        required: true, 
        min: 1, max: 5, 
    }, 
    comment: {
        type: String, 
        trim: true, 
    }
}, {
    Timestamp: true
})

const Review = mongoose.model("Review", reviewSchema); 
export default Review; 