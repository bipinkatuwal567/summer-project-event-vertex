import React, { useEffect, useState } from 'react'
import Logo from "../assets/logos.png"
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthHeroImg from "../assets/sign-in-hero.avif";
import { Link, useNavigate } from 'react-router';
import SyncLoader from "react-spinners/SyncLoader";
import { useDispatch, useSelector } from 'react-redux';
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from "../redux/user/userSlice"
import GoogleAuth from '../components/GoogleAuth';
import toast, { Toaster } from 'react-hot-toast';

const Signin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({})
    const [isHovered, setIsHovered] = useState(false);

    // Add validation states
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const { loading: isLoading, error: errorMessage } = useSelector((state) => ({
        loading: state.user?.loading || false,
        error: state.user?.error || null
    }))

    const userState = useSelector(state => state.user)

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value.trim() });

        // Clear error when user types
        setErrors({
            ...errors,
            [id]: ''
        });
    }

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    const validateForm = () => {
        let valid = true;
        const newErrors = { email: '', password: '' };

        // Validate email
        if (!formData.email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            valid = false;
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
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

            if (!res.ok) {
                toast.error(data.message)
                console.log("Sign in error response: ", data);
                dispatch(signInFailure(data.message || "Sign in failed"))
            } else {
                toast.success("Signed in successfully")
                dispatch(signInSuccess(data.data))
                navigate("/")
            }
        } catch (error) {
            dispatch(signInFailure(error.message || "An unexpected error occurred"))
            console.log("Sign in catch error: ", error);
        }
    }

    useEffect(() => {
        if (userState.currentUser) {
            navigate("/")
        }
    }, [userState.currentUser])

    return (
        <main className="min-h-screen w-full flex mx-auto bg-white">
            <Toaster position='bottom-right' />

            {/* Left Form Section */}
            <div className='flex w-full lg:w-1/2 py-8 px-8 md:px-16 flex-col items-center justify-center'>
                <div className='w-full max-w-md'>
                    <div className="mb-8 flex flex-col items-center">
                        <img src={Logo} className='w-12 h-12 mb-4' alt="Logo" />
                        <h2 className='text-2xl font-bold text-gray-800'>Welcome back</h2>
                        <p className='text-gray-500 mt-2'>Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6 w-full'>
                        <div className='space-y-4'>
                            <div>
                                <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>
                                    Email
                                </label>
                                <input
                                    type='email'
                                    id='email'
                                    onChange={handleChange}
                                    placeholder='you@example.com'
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-blue transition duration-200`}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div>
                            
                                <div className='relative'>
                                    <input
                                        id='password'
                                        type={showPassword ? "text" : "password"}
                                        onChange={handleChange}
                                        placeholder='••••••••'
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-blue transition duration-200`}
                                    />
                                    <button
                                        type="button"
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ?
                                            <Eye className='w-5 h-5' /> :
                                            <EyeOff className='w-5 h-5' />
                                        }
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={isLoading}
                            className={`w-full bg-primary-blue hover:bg-hover-blue text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center`}
                        >
                            {isLoading ? (
                                <SyncLoader size={8} color="#ffffff" />
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>


                    <div className="relative flex items-center justify-center mt-6">
                        <div className="border-t border-gray-300 absolute w-full"></div>
                        <div className="bg-white px-4 relative text-sm text-gray-500">or continue with</div>
                    </div>
                    <GoogleAuth />
                    <p className='text-center text-gray-600 mt-6'>
                        Don't have an account?
                        <Link to={"/sign-up"}>
                            <span className='text-primary-blue hover:text-hover-blue ml-1 font-medium'>
                                Sign up
                            </span>
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Image Section */}
            <div className='hidden lg:block w-1/2 bg-gray-100'>
                <div className='h-full w-full relative overflow-hidden'>
                    <img
                        className='w-full h-full object-cover'
                        src={AuthHeroImg}
                        alt="Auth Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>

                    <Link to={"/"} className="absolute top-8 right-8">
                        <button className='bg-white/20 backdrop-blur-md py-2 px-4 rounded-full text-white border border-white/30 flex items-center gap-2 hover:bg-white/30 transition duration-200'>
                            Back to website
                            <ArrowRight className='w-4 h-4' />
                        </button>
                    </Link>

                    <div className="absolute bottom-12 left-12 max-w-md">
                        <h2 className="text-white text-3xl font-bold mb-4">Discover Amazing Events</h2>
                        <p className="text-white/80 text-lg">
                            Join thousands of attendees and find the perfect events for you.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Signin
