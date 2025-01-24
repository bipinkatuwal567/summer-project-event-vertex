import { useState } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'

function App() {

  return (
    <div className='w-full flex flex-col min-h-screen bg-gray-100'>
      <Header />
      <HeroSection />
    </div>
  )
}

export default App
