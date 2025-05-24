import React from 'react'
import Logo from "../assets/logos.png"
import { Link } from 'react-router'
import Button from './ui/Button'
import { useDispatch, useSelector } from 'react-redux'

import Avatar from './ui/Avatar'

const Header = () => {
    const { currentUser } = useSelector(state => state.user)


    return (
        <nav className='w-full px-8 backdrop-blur-sm md:px-16 py-3  z-50 flex justify-between items-center fixed'>
            <Link to={"/"}>
                <img src={Logo} className='w-8' alt="Logo" />
            </Link>
            {
                currentUser ?
                    <>
                        <Avatar />
                    </>
                    : <Link to="/sign-up" className="block">
                        <button className="h-12 bg-primary text-white px-6 rounded-full shadow-md border-2 border-transparent hover:border-white hover:bg-primary/80 transition-all duration-300 flex items-center gap-2 group">
                            <span>Register</span>
                        </button>
                    </Link>
            }

        </nav>
    )
}
export default Header