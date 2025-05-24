import React from 'react'
import GoogleIcon from "../assets/google.png"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from '../firebase/firebase.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSuccess } from '../redux/user/userSlice';
import toast from 'react-hot-toast';

const GoogleAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth(app);

    const handleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Google auth result:", result);

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: result.user.displayName,
                    email: result.user.email,
                    googlePhotoUrl: result.user.photoURL,
                })
            });

            const data = await res.json();
            console.log("Server response:", data);

            if (res.ok) {
                // First dispatch to Redux
                dispatch(signInSuccess(data));
                console.log("Redux state updated");

                // Then check for navigation
                if (data.isNewUser === true) {
                    console.log("Navigating to success page with data:", data);
                    // Force a small delay before navigation
                    setTimeout(() => {
                        navigate("/google-signup-success", {
                            state: {
                                username: data.username,
                                email: data.email,
                                profilePicture: data.profilePicture
                            }
                        });
                    }, 100);
                } else {
                    console.log("Navigating to homepage");
                    toast.success("Signed in successfully!");
                    navigate("/");
                }
            } else {
                console.error("Google auth failed:", data);
                toast.error("Google authentication failed");
            }
        } catch (error) {
            console.error("Google auth error:", error);
            toast.error("Failed to authenticate with Google");
        }
    }

    return (
        <button
            onClick={handleClick}
            className='flex w-full mt-6 items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-200 text-gray-700 font-medium'
        >
            <img src={GoogleIcon} className='w-5 h-5' alt="Google" />
            Continue with Google
        </button>
    )
}

export default GoogleAuth
