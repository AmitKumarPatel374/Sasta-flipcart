import { Route } from 'lucide-react'
import React from 'react'
import { Routes } from 'react-router-dom'
import ViewProducts from '../pages/ViewProducts'
import UpdateProduct from '../pages/UpdateProduct'


const productRoutes = () => {
  return (
    <Routes>
        <Route path='/view-products' element={<ViewProducts />} />
        <Route path='/update-products' element={<UpdateProduct />} />
    </Routes>
  )
}

export default productRoutes
