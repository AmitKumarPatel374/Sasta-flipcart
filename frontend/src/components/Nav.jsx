import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  const [token , setToken] = useState(localStorage.getItem("token"));
  const [role , setRole] = useState(localStorage.getItem("role"));
  let isUser = role==="user";

  //when token and role change in localstorage change state
  useEffect(()=>{
    const handleStorageChange =()=>{
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    }

    window.addEventListener('storage',handleStorageChange);
    return()=> window.removeEventListener("storage",handleStorageChange);
  },[]);
  
  return (
    <nav className="bg-gray-300 shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">ShopMaster</h1>

      <div className="flex gap-6">

        {token ? (
          isUser ? (
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
                Profile
              </Link>
            </div>
          ) : (<div className="flex gap-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/view-all-product" className="text-gray-700 hover:text-blue-600 transition">
              ViewProducts
            </Link>
            <Link to="/view-users" className="text-gray-700 hover:text-blue-600 transition">
              ViewUsers
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
              Profile
            </Link>
          </div>)
        ) : (
          <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
            Login
          </Link>
        )

        }
      </div>
    </nav >
  );
};

export default Nav;
