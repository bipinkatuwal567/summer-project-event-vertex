import { useState } from 'react'
import Header from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import MainLayout from './components/MainLayout.jsx'
import AuthLayout from './components/AuthLayout.jsx'
import Signin from './pages/Signin.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import UserDashboard from './pages/UserDashboard.jsx'

function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
        </Route>

        {/* Auth related routes */}
        <Route element={<AuthLayout />}>
          <Route path='/sign-up' element={<Signup />} />
          <Route path='/sign-in' element={<Signin />} />
        </Route>

        {/* Private route for authenticated users */}
        <Route element={<PrivateRoute />}>
        <Route path='/user-dashboard' element={<UserDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter >
  )
}

export default App
