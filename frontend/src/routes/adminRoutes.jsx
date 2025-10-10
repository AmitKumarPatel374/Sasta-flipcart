import { Route } from 'lucide-react'
import React from 'react'
import { Routes } from 'react-router-dom'
import ViewUsers from '../pages/ViewUsers'


const adminRoutes = () => {
  return (
    <Routes>
        <Route path='/view-users' element={<ViewUsers />} />
    </Routes>
  )
}

export default adminRoutes

