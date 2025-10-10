import {Route } from 'lucide-react'
import React from 'react'
import { Routes } from 'react-router-dom'
import RegistrationForm from '../pages/RegistrationForm'
import LoginForm from '../pages/LoginForm'
import About from '../pages/About'
import Home from '../pages/Home'
import ForgotPassword from '../pages/ForgotPassword'

const userRutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<RegistrationForm />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/about' element={<About />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
    </Routes>
  )
}

export default userRutes
