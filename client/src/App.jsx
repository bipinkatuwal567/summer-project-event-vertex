import { useState } from 'react'
import Header from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home.jsx'

function App() {

  return (
    <BrowserRouter>

      <div className='w-full flex flex-col min-h-screen bg-gray-100'>
        <Header />

        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
