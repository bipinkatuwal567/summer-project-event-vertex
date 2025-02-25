import React from 'react'
import HeroSection from '../components/HeroSection.jsx'
import Carousel from '../components/Carousel.jsx'

const Home = () => {

    return (
        <div className='w-full flex flex-col overflow-x-hidden min-h-screen bg-white'>
            <HeroSection />
            <Carousel />
        </div>
    )
}

export default Home