import React from 'react'
import Logo from "../assets/logos.png"
import { Link } from 'react-router'

const Header = () => {
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
            <button className='bg-primary text-white py-2 px-6 rounded-full shadow-md hover:bg-slate-800 transition'>Login</button>
        </nav>
    )
}
export default Header