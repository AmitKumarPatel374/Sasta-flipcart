import { Route, Routes } from "react-router-dom"
import RegistrationForm from "../pages/RegistrationForm"
import LoginForm from "../pages/LoginForm"
import About from "../pages/About"
import Home from "../pages/Home"
import ForgotPassword from "../pages/ForgotPassword"
import PageNotFound from "../pages/PageNotFound"
import ViewAllProducts from "../pages/ViewAllProducts"
import CreateProduct from "../pages/CreateProduct"
import ViewUsers from "../pages/ViewUsers"
import Profile from "../pages/Profile"
import UpdateProfile from "../pages/UpdateUserProfile"
import ViewProductDeatail from "../pages/ViewProductDeatail"
import UpdateProduct from "../pages/UpdateProduct"
import GetUser from "../pages/GetUser"
import ViewAdminProducts from "../pages/ViewAdminProducts"
import VerifyContact from "../pages/VerifyContact"
import CategoryBasedTopProduct from "../pages/CategoryBasedTopProduct"
import ProductItems from "../pages/ProductItems"
import FilterByItems from "../pages/FilterByItems"
import SearchItem from "../pages/SearchItem"
import Cart from "../pages/Cart"
import AddressForm from "../pages/AddressForm"
import PaymentPage from "../pages/PaymentPage"
import OrderPage from "../pages/OrderPage"
import TrackOrder from "../pages/TrackOrder"

const UserRutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />
      <Route
        path="/register"
        element={<RegistrationForm />}
      />
      <Route
        path="/login"
        element={<LoginForm />}
      />
      <Route
        path="/about"
        element={<About />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route
        path="/user/:user_id"
        element={<GetUser />}
      />
      <Route
        path="/view-users"
        element={<ViewUsers />}
      />
      <Route
        path="/user-profile"
        element={<Profile />}
      />
      <Route
        path="/update-user-profile"
        element={<UpdateProfile />}
      />
      <Route
        path="/verify-otp"
        element={<VerifyContact />}
      />

      <Route
        path="/view-all-product"
        element={<ViewAllProducts />}
      />
      <Route
        path="/create-product"
        element={<CreateProduct />}
      />
      <Route
        path="/update-product/:product_id"
        element={<UpdateProduct />}
      />
      <Route
        path="/detail/:product_id"
        element={<ViewProductDeatail />}
      />
      <Route
        path="/view-seller-products/:user_id"
        element={<ViewAdminProducts />}
      />
      <Route
        path="/:category"
        element={<CategoryBasedTopProduct />}
      />
      <Route
        path="/:category/:subCategory/:item"
        element={<ProductItems />}
      />
      <Route
        path="/filter/:category/:subCategory/:item"
        element={<FilterByItems />}
      />
      <Route
        path="/search/:searchValue"
        element={<SearchItem />}
      />
      <Route
        path="/product/cart"
        element={<Cart />}
      />
      <Route
        path="/product/cart/address"
        element={<AddressForm />}
      />
      <Route
        path="/product/cart/address/payment"
        element={<PaymentPage />}
      />
      <Route
        path="/product/orders"
        element={<OrderPage />}
      />
      <Route
        path="/product/orders/track/:order_id"
        element={<TrackOrder />}
      />

      <Route
        path="*"
        element={<PageNotFound />}
      />
    </Routes>
  )
}

export default UserRutes
