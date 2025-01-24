import React from 'react'
import Logo from "../assets/logos.png"

const Header = () => {
    return (
        <nav className='w-full px-8 md:px-16 py-3 border-b flex justify-between items-center'>
            <img src={Logo} className='w-8' alt="Logo" />
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