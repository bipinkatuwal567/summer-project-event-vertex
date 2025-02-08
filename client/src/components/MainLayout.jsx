import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'

const MainLayout = () => {
    return (
        <div className='w-full flex flex-col min-h-screen bg-gray-100'>
            <Header />
            <Outlet />
        </div>
    )
}

export default MainLayout