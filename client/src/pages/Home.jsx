import React from 'react'
import HeroSection from '../components/HeroSection.jsx'
import { useSelector } from 'react-redux'

const Home = () => {
    const {currentUser} = useSelector(state => state.user)
    console.log(currentUser);
    
    return (
        <div className='w-full flex flex-col min-h-screen bg-gray-100'>
            <HeroSection />
        </div>
    )
}

export default Home