import React from 'react'
import HeroSection from '../components/HeroSection.jsx'
import Carousel from '../components/Carousel.jsx'
import EventList from '../components/EventList.jsx'

const Home = () => {
  return (
    <div className='w-full flex flex-col overflow-x-hidden bg-white'>
      <HeroSection />
      <Carousel />
      <EventList />
    </div>
  )
}

export default Home
