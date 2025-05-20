import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../../redux/user/userSlice';
import { Link } from 'react-router';
import { LogOut } from 'lucide-react';

const Avatar = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user)
    console.log(currentUser);


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
        <div className="dropdown dropdown-end">
            <div tabIndex={0} className="avatar">
                <div className="w-10 rounded-full ring-2 ring-gray-300">
                    <img className='w-full h-full' src={currentUser.profilePicture} referrerPolicy="no-referrer" />
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu dropdown-content bg-gray-100 border border-gray-300 rounded-lg z-[1] mt-4 shadow flex px-2 justify-center items-center min-w-[200px] w-auto whitespace-nowrap">
                <div className='flex flex-col px-1 gap-2 w-full'>
                    <p className='font-medium'>Signed in as:</p>
                    <p className='font-medium truncate max-w-[250px]'>{currentUser.email}</p>
                </div>
                <div className='mt-2 w-full border-t-2 pt-1 border-gray-200'>
                    <li className='hover:bg-gray-200 rounded-md'><Link to={"/"} className='p-2 text-gray-600'>Home</Link></li>
                    <li className='hover:bg-gray-200 rounded-md'><Link to={"/user-dashboard?tab=profile"} className='p-2 text-gray-600'>Manage Account</Link></li>
                    <li className='hover:bg-gray-200 rounded-md' onClick={handleSignout}><a className='p-2 text-gray-600'>Sign out <LogOut className='w-4' /></a></li>
                    {currentUser.role === "organizer" ? (
                        <>
                            <li className='hover:bg-gray-200 rounded-md sm:hidden'><Link to={"/user-dashboard?tab=dashboard"} className='p-2 text-gray-600'>Dashboard</Link></li>
                            <li className='hover:bg-gray-200 rounded-md sm:hidden'><Link to={"/user-dashboard?tab=myevents"} className='p-2 text-gray-600'>My Events</Link></li>
                            <li className='hover:bg-gray-200 rounded-md sm:hidden'><Link to={"/user-dashboard?tab=event"} className='p-2 text-gray-600'>Create an Event</Link></li>
                        </>
                    ) : null}
                </div>
            </ul>
        </div>
    )
}

export default Avatar
