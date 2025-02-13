import React, { useEffect, useState } from 'react'
import Logo from "../assets/logos.png"
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

import AuthHeroImg from "../assets/auth-hero.jpg";
import { Link, useNavigate } from 'react-router';
import SyncLoader from "react-spinners/SyncLoader";
import { useSelector } from 'react-redux';
import GoogleAuth from '../components/GoogleAuth';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const { currentUser } = useSelector(state => state.user)


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || formData.username.trim() === "" ||
            !formData.email || formData.email.trim() === "" ||
            !formData.password || formData.password.trim() === "") {
            setErrorMessage("Please fill up all the fields!")
        }

        try {
            setIsLoading(true);
            setErrorMessage(null)

            const res = await fetch("api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username.toLowerCase().split(" ").join(""),
                    email: formData.email.toLowerCase().split(" ").join(""),
                    password: formData.password
                })
            })

            const data = await res.json();

            console.log(data);

            if (!res.ok) {
                setIsLoading(false);
                console.log("Sign up error response: ", data);

                setErrorMessage(data.message || "Signup failed")
                return;
            }

            setIsLoading(false);
            navigate("/sign-in")
        } catch (error) {
            setIsLoading(false)
            console.log("Sign up catch error: ", error);
            setErrorMessage(error.message || "An unexpected error occurred")
        }
    }

    useEffect(() => {
        if(currentUser){
            navigate("/")
        }
    }, [currentUser])

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
                    <h2 className='text-xl text-slate-900 font-semibold'>Welcome to Event Vertex</h2>
                    <p className='text-slate-500'>Let's create an account</p>

                    <div className='flex flex-col gap-3 mt-4 w-full items-start'>
                        <div className='flex flex-col gap-1 w-full items-start'>
                            <label
                                htmlFor='username'
                                className='text-slate-500'>Username</label>
                            <input
                                type='text'
                                id='username'
                                onChange={(e) => handleChange(e)}
                                placeholder='John Doe' className='px-2 py-1.5 rounded-md w-full bg-transparent border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-700 transition duration-300' />
                        </div>
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
                                    speedMultiplier={0.68} color={isHovered ? "#000000" : "#ffffff"} /> : "Create an account"
                            }
                        </button>
                        <p className='text-slate-500'>or</p>
                        <GoogleAuth />
                    </div>

                    <p className='text-slate-600'>Already have an account? <Link to={"/sign-in"}><span className='text-black underline'>Sign in</span></Link></p>
                </form>
            </div>
        </main>
    )
}

export default Signup
