import React, { useEffect, useState } from 'react'
import Logo from "../assets/logos.png"
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import GoogleIcon from "../assets/google.png"
import AuthHeroImg from "../assets/sign-in-hero.avif";
import { Link, useNavigate } from 'react-router';
import SyncLoader from "react-spinners/SyncLoader";
import { useDispatch, useSelector } from 'react-redux';
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from "../redux/user/userSlice"

const Signin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({})
    const [isHovered, setIsHovered] = useState(false);

    const { loading: isLoading, error: errorMessage } = useSelector((state) => ({
        loading: state.user?.loading || false,
        error: state.user?.error || null
    }))

    const userState = useSelector(state => state.user)
    console.log(userState);
    

    console.log(formData);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || formData.email.trim() === "" ||
            !formData.password || formData.password.trim() === "") {
            dispatch(signInFailure("Please fill up all the fields!"))
        }

        try {
            dispatch(signInStart())
            const res = await fetch("api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email.toLowerCase().trim(),
                    password: formData.password.trim()
                })
            })

            const data = await res.json();

            console.log(data);

            if (!res.ok) {
                console.log("Sign up error response: ", data);
                dispatch(signInFailure(data.message || "Signup failed"))
            }

            dispatch(signInSuccess(data.data))
            navigate("/")
        } catch (error) {
            dispatch(signInFailure(error.message || "An unexpected error occurred"))
            console.log("Sign up catch error: ", error);
        }
    }

    useEffect(() => {
        if(userState.currentUser){
            navigate("/")
        }
    }, [useState])

    return (
        <main className="min-h-screen w-full flex mx-auto justify-center items-center text-center">

            {/* Image Section */}
            <div className='hidden relative lg:flex w-full h-screen max-h-screen max-w-screen p-2'>
                <img className='w-full h-full object-cover rounded-3xl' src={AuthHeroImg} alt="Auth Background" />

                <Link to={"/"}>
                    <button className='absolute bg-white/15 right-8 top-8 py-1 px-3 rounded-full text-white backdrop-filter backdrop-blur-xl border border-gray-500 flex gap-2 items-center'>Back to website
                        <ArrowRight className='w-5 h-5' />
                    </button>
                </Link>
            </div>

            {/* Form Section */}
            <div className='flex py-4 px-12 flex-col w-full max-w-md items-center gap-4 lg:max-w-full'>
                <form onSubmit={handleSubmit} className='flex flex-col w-full max-w-sm items-center gap-4'>
                    <img src={Logo} className='w-8' alt="Logo" />
                    <h2 className='text-xl text-slate-900 font-semibold'>Welcome back</h2>
                    <p className='text-slate-500'>Let's sign you in</p>

                    <div className='flex flex-col gap-3 mt-4 w-full items-start'>

                        <div className='flex flex-col gap-1 w-full items-start'>
                            <label
                                htmlFor="email"
                                className='text-slate-500'>Email</label>
                            <input
                                type='email'
                                id='email'
                                onChange={(e) => handleChange(e)}
                                placeholder='Johndoe1@example.com' className='px-2 py-1.5 rounded-md w-full bg-transparent border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-700 transition duration-300' />
                        </div>
                        <div className='flex flex-col gap-1 w-full items-start'>
                            <label
                                htmlFor='password'
                                className='text-slate-500'>Password</label>
                            <div className='w-full relative'>
                                <input
                                    id='password'
                                    type={showPassword ? "text" : "password"}
                                    onChange={(e) => handleChange(e)} placeholder='********' className='px-2 py-1.5 rounded-md w-full bg-transparent border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-700 transition duration-300' />
                                <button className='absolute flex items-center justify-center right-3 inset-y-0' onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <Eye className='w-4 h-4 text-slate-500 hover:text-slate-700 transition duration-300' /> : <EyeOff className='w-4 h-4 hover:text-slate-700 transition duration-300 text-slate-500' />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex flex-col gap-2 items-center'>
                        <button type='submit'
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className={`bg-primary w-full justify-center h-12 text-white  px-6 rounded-full shadow-md hover:bg-white border-2 border-black hover:text-black transition-all duration-300 flex items-center gap-4`}>
                            {
                                isLoading ? <SyncLoader
                                    size={8}
                                    speedMultiplier={0.68} color={isHovered ? "#000000" : "#ffffff"} /> : "Sign in"
                            }
                        </button>
                        <p className='text-slate-500'>or</p>
                        <button className='flex items-center gap-2 h-12 rounded-full transition-all duration-300 w-full justify-center bg-slate-200 hover:bg-slate-300'>
                            <img src={GoogleIcon} className='w-4 h-4' />
                            Sign in with Google
                        </button>
                    </div>

                    <p className='text-slate-600'>Don't have an account? <Link to={"/sign-up"}><span className='text-black underline'>Sign up</span></Link></p>
                </form>
            </div>
        </main>
    )
}

export default Signin
