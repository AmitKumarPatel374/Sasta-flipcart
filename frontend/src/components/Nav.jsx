import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="bg-gray-300 shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">ShopMaster</h1>

      <div className="flex gap-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
          Home
        </Link>
        <Link to="/view-all-product" className="text-gray-700 hover:text-blue-600 transition">
          Products
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">
          About
        </Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
