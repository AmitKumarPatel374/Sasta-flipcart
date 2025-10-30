import { Route, Routes } from 'react-router-dom'
import RegistrationForm from '../pages/RegistrationForm'
import LoginForm from '../pages/LoginForm'
import About from '../pages/About'
import Home from '../pages/Home'
import ForgotPassword from '../pages/ForgotPassword'
import PageNotFound from '../pages/PageNotFound'
import ViewAllProducts from '../pages/ViewAllProducts'
import CreateProduct from '../pages/CreateProduct'
import ViewUsers from '../pages/ViewUsers'
import Profile from '../pages/Profile'

const UserRutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<RegistrationForm />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/about' element={<About />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/view-all-product' element={<ViewAllProducts />} />
            <Route path='/create-product' element={<CreateProduct />} />
            <Route path='/view-users' element={<ViewUsers />} />
            <Route path='/profile' element={<Profile />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

export default UserRutes
