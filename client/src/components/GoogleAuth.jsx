import React from 'react'
import GoogleIcon from "../assets/google.png"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from '../firebase/firebase.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { signInSuccess } from '../redux/user/userSlice';

const GoogleAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth(app);
    const handleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result);
            
            const res = await fetch ("/api/auth/google", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                }, 
                body: JSON.stringify({
                    username: result.user.displayName,
                    email: result.user.email,
                    googlePhotoUrl: result.user.photoURL,
                })
            })

            const data = await res.json();

            if(res.ok){
                dispatch(signInSuccess(data)); 
                navigate("/");
            }
            
        } catch (error) {
            console.log("Google auth error:", error);
        }
    }
    return (
        <button onClick={handleClick} className='flex max-w-sm items-center gap-2 h-12 rounded-full transition-all duration-300 w-full justify-center bg-slate-200 hover:bg-slate-300'>
            <img src={GoogleIcon} className='w-4 h-4' />
            Register with Google
        </button>
    )
}

export default GoogleAuth