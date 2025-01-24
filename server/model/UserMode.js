import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
    }, 
    password: {
        type: String,
        required: true,
    }, 
    profilePicture: {
        type: String,
        default: "https://imgs.search.brave.com/skDNwq7zZQO3Fx033dB2EKjvJZNncIpdZ3hk47OSVTU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZWxldmVuZm9ydW0u/Y29tL2RhdGEvYXR0/YWNobWVudHMvODIv/ODI1MjktYWRlNjNl/NDIwOTcwOTI5MjE4/M2Y2NTQ5MDdiMTY4/ZjUuanBnP2hhc2g9/cmVZLVFnbHdrcA"
    }, 
    role: {
        type: String,
        enum: ['attendee', 'organizer', 'admin'], default: "attendee"
    },
    
}, {Timestamp: true})

const User = mongoose.model('User', userSchema);

export default User;