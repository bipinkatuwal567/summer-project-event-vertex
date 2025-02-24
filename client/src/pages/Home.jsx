import React from 'react'
import HeroSection from '../components/HeroSection.jsx'
import { useSelector } from 'react-redux'
import Carousel from '../components/Carousel.jsx'

const Home = () => {
    const {currentUser} = useSelector(state => state.user)
    console.log(currentUser);
    
    return (
        <div className='w-full flex flex-col overflow-x-hidden min-h-screen bg-gray-100'>
            <HeroSection />
            <Carousel />
        </div>
    )
}

export default Home