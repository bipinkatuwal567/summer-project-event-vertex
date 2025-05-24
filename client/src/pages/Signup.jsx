import React, { useEffect, useState } from 'react'
import Logo from "../assets/logos.png"
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

import AuthHeroImg from "../assets/auth-hero.jpg";
import { Link, useNavigate } from 'react-router';
import SyncLoader from "react-spinners/SyncLoader";
import { useSelector } from 'react-redux';
import GoogleAuth from '../components/GoogleAuth';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const { currentUser } = useSelector(state => state.user)

    // Add validation states
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: ''
    });

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

    // Password validation function
    const validatePassword = (password) => {
        return password.length >= 6;
    }

    // Username validation
    const validateUsername = (username) => {
        return username.length >= 3;
    }

    const validateForm = () => {
        let valid = true;
        const newErrors = { username: '', email: '', password: '' };

        // Validate username
        if (!formData.username || !validateUsername(formData.username)) {
            newErrors.username = 'Username must be at least 3 characters';
            valid = false;
        }

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
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 6 characters';
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
            setIsLoading(true);
            setErrorMessage(null);

            const res = await fetch("api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username.toLowerCase().split(" ").join(""),
                    email: formData.email.toLowerCase().split(" ").join(""),
                    password: formData.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setIsLoading(false);
                toast.error(data.message || "Signup failed");
                setErrorMessage(data.message || "Signup failed");
                return;
            } else {
                setIsLoading(false);
                // Instead of redirecting to sign-in, redirect to the success page
                navigate("/account-created-success");
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(error.message || "An unexpected error occurred");
            setErrorMessage(error.message || "An unexpected error occurred");
        }
    }

    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
    }, [currentUser]);

    return (
        <main className="h-screen w-full flex mx-auto bg-white">
            <Toaster position='bottom-right' />

            {/* Left Form Section */}
            <div className='flex w-full lg:w-1/2 py-8 px-8 md:px-16 flex-col items-center justify-center'>
                <div className='w-full max-w-md'>
                    <div className="mb-8 flex flex-col items-center">
                        <img src={Logo} className='w-12 h-12 mb-4' alt="Logo" />
                        <h2 className='text-2xl font-bold text-gray-800'>Create an account</h2>
                        <p className='text-gray-500 mt-2'>Join Event Vertex to discover amazing events</p>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6 w-full'>
                        <div className='space-y-4'>
                            <div>
                                <label htmlFor="username" className='block text-sm font-medium text-gray-700 mb-1'>
                                    Username
                                </label>
                                <input
                                    type='text'
                                    id='username'
                                    onChange={handleChange}
                                    placeholder='johndoe'
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-blue transition duration-200`}
                                />
                                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                            </div>

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
                                <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                                    Password
                                </label>
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

                        {errorMessage && <p className="text-center text-sm text-red-500">{errorMessage}</p>}

                        <button
                            type='submit'
                            disabled={isLoading}
                            className={`w-full bg-primary-blue hover:bg-hover-blue text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center`}
                        >
                            {isLoading ? (
                                <SyncLoader size={8} color="#ffffff" />
                            ) : (
                                'Create account'
                            )}
                        </button>

                        <div className="relative flex items-center justify-center mt-6">
                            <div className="border-t border-gray-300 absolute w-full"></div>
                            <div className="bg-white px-4 relative text-sm text-gray-500">or continue with</div>
                        </div>
                    </form>

                    <GoogleAuth />

                    <p className='text-center text-gray-600 mt-6'>
                        Already have an account?
                        <Link to={"/sign-in"}>
                            <span className='text-primary-blue hover:text-hover-blue ml-1 font-medium'>
                                Sign in
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
                        <h2 className="text-white text-3xl font-bold mb-4">Join Our Community</h2>
                        <p className="text-white/80 text-lg">
                            Create an account to discover, book, and attend the best events in your area.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Signup
