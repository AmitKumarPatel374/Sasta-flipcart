import React from 'react'
import { useState } from 'react';
import Nav from './components/Nav';
import ProductRoutes from './routes/productRoutes';
import AdminRoutes from './routes/adminRoutes';
import UserRoutes from './routes/UserRoutes';
import { Route, Routes } from 'react-router-dom';


const App = () => {
  const [toggle, setTogggle] = useState(true);
  return (
    <div>
      <Nav />
      <Routes>
        {/* Mount all routes with base paths */}
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/product/*" element={<ProductRoutes />} />
      </Routes>
    </div>
  )
}

export default App
