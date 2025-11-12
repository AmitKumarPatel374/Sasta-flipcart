import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { usercontext } from "../context/DataContext";
import { Menu, X } from "lucide-react";

const Nav = () => {
  const { token, role, user_id } = useContext(usercontext);
  const isUser = role === "user";
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const linkClass = ({ isActive }) =>
    `transition font-medium ${
      isActive
        ? "text-blue-600 "
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-gray-200 h-20 px-6 py-3 flex justify-between items-center relative border-b border-gray-300">
      <NavLink to="/" className="flex items-center gap-2">
        <img
          src="/myLogo.png"
          alt="ShopMaster Logo"
          className="h-15 w-auto object-contain absolute"
        />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center">
        {token ? (
          isUser ? (
            <>
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink to="/view-all-product" className={linkClass}>Products</NavLink>
              <NavLink to="/about" className={linkClass}>About</NavLink>
              <NavLink to="/user-profile" className={linkClass}>Profile</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink to={`/view-seller-products/${user_id}`} className={linkClass}>
                Products
              </NavLink>
              <NavLink to="/create-product" className={linkClass}>Create Product</NavLink>
              <NavLink to="/view-users" className={linkClass}>View Users</NavLink>
              <NavLink to="/about" className={linkClass}>About</NavLink>
              <NavLink to="/user-profile" className={linkClass}>Profile</NavLink>
            </>
          )
        ) : (
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700 hover:text-blue-600 transition"
        onClick={toggleMenu}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-300 flex flex-col items-start gap-4 p-4 border-t border-gray-400 md:hidden z-50">
          {token ? (
            isUser ? (
              <>
                <NavLink to="/" onClick={toggleMenu} className={linkClass}>Home</NavLink>
                <NavLink to="/view-all-product" onClick={toggleMenu} className={linkClass}>
                  Products
                </NavLink>
                <NavLink to="/about" onClick={toggleMenu} className={linkClass}>About</NavLink>
                <NavLink to="/user-profile" onClick={toggleMenu} className={linkClass}>
                  Profile
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/" onClick={toggleMenu} className={linkClass}>Home</NavLink>
                <NavLink
                  to={`/view-seller-products/${user_id}`}
                  onClick={toggleMenu}
                  className={linkClass}
                >
                  Products
                </NavLink>
                <NavLink to="/create-product" onClick={toggleMenu} className={linkClass}>
                  Create Product
                </NavLink>
                <NavLink to="/view-users" onClick={toggleMenu} className={linkClass}>
                  View Users
                </NavLink>
                <NavLink to="/about" onClick={toggleMenu} className={linkClass}>About</NavLink>
                <NavLink to="/user-profile" onClick={toggleMenu} className={linkClass}>
                  Profile
                </NavLink>
              </>
            )
          ) : (
            <NavLink to="/login" onClick={toggleMenu} className={linkClass}>
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
