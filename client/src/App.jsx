import { useState } from 'react'
import Header from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'

function App() {

  return (
    <BrowserRouter>

      <div className='w-full flex flex-col min-h-screen bg-gray-100'>
        <Header />

        <Routes>
          <Route path='/' element={<Home />} />

          {/* Auth related routes */}
          <Route path='/sign-up' element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
