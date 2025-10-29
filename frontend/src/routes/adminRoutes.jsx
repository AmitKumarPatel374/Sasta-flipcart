import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ViewUsers from '../pages/ViewUsers'
import Home from '../pages/Home'
import PageNotFound from '../pages/PageNotFound'


const AdminRoutes = () => {
  return (
    <Routes>
        <Route path='/view-users' element={<ViewUsers />} />
        <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default AdminRoutes

