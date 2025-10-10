import { Route, Routes } from 'react-router-dom'
import ViewProducts from '../pages/ViewAllProducts'
import UpdateProduct from '../pages/UpdateProduct'
import ViewProduct from '../pages/ViewProduct'
import ViewAllProducts from '../pages/ViewAllProducts'
import Home from '../pages/Home'
import PageNotFound from '../pages/PageNotFound'


const ProductRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<ViewProduct />} />
        <Route path='/view-all-product' element={<ViewAllProducts />} />
        <Route path='/update-products' element={<UpdateProduct />} />
        <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default ProductRoutes
