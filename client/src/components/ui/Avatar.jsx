import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../../redux/user/userSlice';
import { Link } from 'react-router-dom';
import { LogOut, User, Settings, Home, LayoutDashboard, CalendarPlus2 } from 'lucide-react';

const Avatar = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignout = async () => {
        try {
            const res = await fetch("/api/auth/signout", { method: "GET" });
            const data = await res.json();

            if (res.ok) {
                dispatch(signOutSuccess());
                setIsOpen(false);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="avatar flex items-center focus:outline-none"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className="w-10 h-10 rounded-full ring-2 ring-gray-300 overflow-hidden transition-all hover:ring-primary-blue">
                    <img 
                        className='w-full h-full object-cover' 
                        src={currentUser?.profilePicture} 
                        alt={`${currentUser?.username}'s profile`}
                        referrerPolicy="no-referrer" 
                    />
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden transition-all duration-200 ease-in-out">
                    {/* User Info Section */}
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <img 
                                src={currentUser?.profilePicture} 
                                alt={currentUser?.username} 
                                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                            />
                            <div className="overflow-hidden">
                                <p className="font-semibold text-gray-800">{currentUser?.username}</p>
                                <p className="text-sm text-gray-600 truncate">{currentUser?.email}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    currentUser?.role === "organizer" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                                }`}>
                                    {currentUser?.role === "organizer" ? "Organizer" : "Attendee"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <Link to="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                            <Home className="w-4 h-4 mr-3 text-gray-500" />
                            Home
                        </Link>
                        <Link to="/user-dashboard?tab=profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                            <Settings className="w-4 h-4 mr-3 text-gray-500" />
                            Manage Account
                        </Link>
                        
                        {currentUser?.role === "organizer" && (
                            <>
                                <div className="border-t border-gray-100 my-1"></div>
                                <Link to="/user-dashboard?tab=dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <LayoutDashboard className="w-4 h-4 mr-3 text-gray-500" />
                                    Dashboard
                                </Link>
                                <Link to="/user-dashboard?tab=myevents" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <User className="w-4 h-4 mr-3 text-gray-500" />
                                    My Events
                                </Link>
                                <Link to="/user-dashboard?tab=event" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <CalendarPlus2 className="w-4 h-4 mr-3 text-gray-500" />
                                    Create Event
                                </Link>
                            </>
                        )}
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                            onClick={handleSignout}
                            className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Avatar
