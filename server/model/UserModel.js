import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    }, 
    password: {
        type: String,
        required: true,
    }, 
    profilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/9073/9073143.png"
    }, 
    role: {
        type: String,
        enum: ['attendee', 'organizer', 'admin'], default: "attendee"
    },
    
}, {Timestamp: true})

const User = mongoose.model('User', userSchema);

export default User;