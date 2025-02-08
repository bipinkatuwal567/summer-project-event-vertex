import React, { useState } from 'react'
import Logo from "../assets/logos.png"
import { Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import GoogleIcon from "../assets/google.png"
import AuthHeroImg from "../assets/auth-hero.jpg";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <main className="min-h-screen w-full flex mx-auto justify-center items-center text-center">

            {/* Image Section */}
            <div className='hidden lg:flex w-full h-screen max-h-screen max-w-screen p-2'>
                <img className='w-full h-full object-cover rounded-3xl' src={AuthHeroImg} alt="Auth Background" />
            </div>

            {/* Form Section */}
            <div className='flex py-4 px-12 flex-col w-full max-w-md items-center gap-4 lg:max-w-full'>
                <div className='lg:flex flex-col w-full max-w-md items-center gap-4'>
                    <img src={Logo} className='w-8' alt="Logo" />
                    <h2 className='text-xl text-slate-900 font-semibold'>Welcome to Event Vertex</h2>
                    <p className='text-slate-500'>Let's create an account</p>

                    <div className='flex flex-col gap-3 mt-4 w-full items-start'>
                        <div className='flex flex-col gap-1 w-full items-start'>
                            <label className='text-slate-500'>Username</label>
                            <input placeholder='John Doe' className='px-2 py-1.5 rounded-md w-full bg-transparent border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-700 transition duration-300' />
                        </div>
                        <div className='flex flex-col gap-1 w-full items-start'>
                            <label className='text-slate-500'>Email</label>
                            <input placeholder='Johndoe1@example.com' className='px-2 py-1.5 rounded-md w-full bg-transparent border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-700 transition duration-300' />
                        </div>
                        <div className='flex flex-col gap-1 w-full items-start'>
                            <label className='text-slate-500'>Password</label>
                            <div className='w-full relative'>
                                <input type={showPassword ? "text" : "password"} placeholder='********' className='px-2 py-1.5 rounded-md w-full bg-transparent border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-700 transition duration-300' />
                                <button className='absolute flex items-center justify-center right-3 inset-y-0' onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <Eye className='w-4 h-4 text-slate-500 hover:text-slate-700 transition duration-300' /> : <EyeOff className='w-4 h-4 hover:text-slate-700 transition duration-300 text-slate-500' />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex flex-col gap-2 items-center'>
                        <Button title={"Create an account"} className={"w-full justify-center mt-2"} />
                        <p className='text-slate-500'>or</p>
                        <button className='flex items-center gap-2 py-2 px-6 rounded-full transition-all duration-300 w-full justify-center bg-slate-200 hover:bg-slate-300'>
                            <img src={GoogleIcon} className='w-4 h-4' />
                            Register with Google
                        </button>
                    </div>

                    <p className='text-slate-600'>Already have an account? <span className='text-black underline'>Sign in</span></p>
                </div>
            </div>
        </main>
    )
}

export default Signup
