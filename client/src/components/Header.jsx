import React from 'react'
import Logo from "../assets/logos.png"
import { Link } from 'react-router'
import Button from './ui/Button'
import { useDispatch, useSelector } from 'react-redux'
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
                currentUser ? <div className="dropdown dropdown-end">
                    <div tabIndex={0} className="avatar">
                        <div className="w-10 rounded-full ring-2 ring-gray-300">
                            <img className='w-full h-full' src={currentUser.profilePicture} referrerPolicy="no-referrer" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content bg-gray-100 border border-gray-300 rounded-lg z-[1] mt-4 p-2 shadow">
                        <li><a>{currentUser.username}</a></li>
                        <li onClick={handleSignout}><a>Sign out</a></li>
                    </ul>
                </div> : <Link to={"/sign-up"}>
                    <Button title={"Register"} />
                </Link>
            }

        </nav>
    )
}
export default Header