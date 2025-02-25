import React from 'react'
import Logo from "../assets/logos.png"
import { Link } from 'react-router'
import Button from './ui/Button'
import { useDispatch, useSelector } from 'react-redux'

import Avatar from './ui/Avatar'

const Header = () => {
    const { currentUser } = useSelector(state => state.user)


    return (
        <nav className='w-full px-8 backdrop-blur-sm md:px-16 py-3 border-b border-slate-300 flex justify-between items-center fixed'>
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
                       <Avatar />
                    </>
                    : <Link to={"/sign-up"}>
                        <Button title={"Register"} />
                    </Link>
            }

        </nav>
    )
}
export default Header