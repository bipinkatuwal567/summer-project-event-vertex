import React from 'react'
import { Outlet } from 'react-router'

const AuthLayout = () => {
    return (
        <div className='w-full flex flex-col min-h-screen bg-gray-100'>
            <Outlet />
        </div>
    )
}

export default AuthLayout