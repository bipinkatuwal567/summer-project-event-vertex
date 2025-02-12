import React from 'react'
import Logo from "../assets/logos.png"
import { Link } from 'react-router'
import Button from './ui/Button'
import { useDispatch, useSelector } from 'react-redux'
import { LogOut } from 'lucide-react';

import {
    signOutSuccess
} from "../redux/user/userSlice"

const Header = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user)

    const handleSignout = async () => {
        try {
            const res = await fetch("/api/auth/signout", { method: "GET" })
            const data = await res.json;

            if (res.ok) {
                dispatch(signOutSuccess());
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error, "something went wrong while signning out the user");
        }
    }

    return (
        <nav className='w-full px-8 md:px-16 py-3 border-b border-slate-300 flex justify-between items-center fixed'>
            <Link to={"/"}>
                <img src={Logo} className='w-8' alt="Logo" />
            </Link>
            <div className='flex gap-12'>
                {/* <a className='hover:underline' href="#">Home</a>
                <a className='hover:underline' href="#">Events</a>
                <a className='hover:underline' href="#">Create an event</a>
                <a className='hover:underline' href="#">About us</a> */}
            </div>
            {
                currentUser ?
                    <>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} className="avatar">
                                <div className="w-10 rounded-full ring-2 ring-gray-300">
                                    <img className='w-full h-full' src={currentUser.profilePicture} referrerPolicy="no-referrer" />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu dropdown-content bg-gray-100 border border-gray-300 rounded-lg z-[1] mt-4 shadow flex px-2 justify-center items-center">
                                <div className='flex flex-col px-1 gap-2'>
                                    <p className='font-medium'>Signed in as:</p>
                                    <p className='font-medium cap'>{currentUser.email}</p>
                                </div>
                                <div className='mt-2 w-full border-t-2 pt-1 border-gray-200'>
                                <li className='hover:bg-gray-200 rounded-md'><a className='p-2 text-gray-600'>Manage Account</a></li>
                                <li className='hover:bg-gray-200 rounded-md' onClick={handleSignout}><a className='p-2 text-gray-600'>Sign out <LogOut className='w-4' /></a></li>
                                </div>
                            </ul>
                        </div>
                    </>
                    : <Link to={"/sign-up"}>
                        <Button title={"Register"} />
                    </Link>
            }

        </nav>
    )
}
export default Header