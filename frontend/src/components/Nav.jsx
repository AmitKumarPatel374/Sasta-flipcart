import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { usercontext } from "../context/DataContext";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import gsap from "gsap";

const Nav = () => {
  const { token, role, user_id } = useContext(usercontext);
  const isUser = role === "user";
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setMobileSearchOpen(!mobileSearchOpen);

  const searchHandler = () => {
    if (!searchValue.trim()) return;
    navigate(`/search/${searchValue}`);
  };

  // Mobile Menu GSAP Animation
  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.35 }
      );
    }
  }, [menuOpen]);

  // Mobile Search GSAP Animation
  useEffect(() => {
    if (mobileSearchOpen) {
      gsap.fromTo(
        searchRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
  }, [mobileSearchOpen]);

  const linkClass = ({ isActive }) =>
    `transition font-medium ${
      isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-gray-200 h-20 px-6 py-3 flex justify-between items-center relative border-b border-gray-300">

      {/* ---------------- LOGO ---------------- */}
      <NavLink to="/" className="flex items-center gap-2">
        <img src="/myLogo.png" alt="ShopMaster Logo" className="h-14 w-auto" />
      </NavLink>

      {/* Spacer to push search in center (Desktop) */}
      <div className="hidden md:flex flex-1"></div>

      {/* ---------------- DESKTOP SEARCH BAR ---------------- */}
      <div className="hidden md:flex items-center w-[280px] bg-white rounded-full px-4 py-2 shadow-sm border mx-4">
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchHandler()}
          type="text"
          placeholder="Search products..."
          className="w-full px-3 outline-none text-gray-700"
        />
        <button onClick={searchHandler}>
          <Search size={18} className="text-gray-600 cursor-pointer" />
        </button>
      </div>

      {/* ---------------- DESKTOP MENU ---------------- */}
      <div className="hidden md:flex gap-6 items-center">
        {token ? (
          isUser ? (
            <>
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink to="/view-all-product" className={linkClass}>Products</NavLink>
              <NavLink to="/about" className={linkClass}>About</NavLink>
              <NavLink to="/product/orders" className={linkClass}>Orders</NavLink>
              <NavLink to="/product/cart" className={linkClass}> <ShoppingCart /></NavLink>
              <NavLink to="/user-profile" className={linkClass}>Profile</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink
                to={`/view-seller-products/${user_id}`}
                className={linkClass}
              >
                Products
              </NavLink>
              <NavLink to="/create-product" className={linkClass}>Create Product</NavLink>
              <NavLink to="/view-users" className={linkClass}>View Users</NavLink>
              <NavLink to="/about" className={linkClass}>About</NavLink>
              <NavLink to="/user-profile" className={linkClass}>Profile</NavLink>
            </>
          )
        ) : (
          <NavLink to="/login" className={linkClass}>Login</NavLink>
        )}
      </div>

      {/* ---------------- MOBILE BUTTONS ---------------- */}
      <div className="flex md:hidden gap-4 items-center">

        {/* Mobile Search Button */}
        <button onClick={toggleSearch} className="text-gray-700 hover:text-blue-600 transition">
          <Search size={26} />
        </button>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 transition">
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ---------------- MOBILE SEARCH BOX ---------------- */}
      {mobileSearchOpen && (
        <div
          ref={searchRef}
          className="absolute top-full left-0 w-full bg-white p-4 shadow-md border-t border-gray-300 md:hidden z-50"
        >
          <div className="flex items-center gap-3 border px-4 py-2 rounded-full bg-gray-100">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchHandler()}
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent outline-none"
            />
            <button onClick={searchHandler}>
              <Search size={20} className="text-gray-600 cursor-pointer" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------- MOBILE NAV MENU ---------------- */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 w-full bg-gray-300 flex flex-col items-start gap-4 p-4 border-t border-gray-400 md:hidden z-50"
        >
          {token ? (
            isUser ? (
              <>
                <NavLink to="/" onClick={toggleMenu} className={linkClass}>Home</NavLink>
                <NavLink to="/view-all-product" onClick={toggleMenu} className={linkClass}>Products</NavLink>
                <NavLink to="/about" onClick={toggleMenu} className={linkClass}>About</NavLink>
                <NavLink to="/product/orders" className={linkClass}>Orders</NavLink>
                <NavLink to="/product/cart" onClick={toggleMenu} className={linkClass}> <ShoppingCart /></NavLink>
                <NavLink to="/user-profile" onClick={toggleMenu} className={linkClass}>Profile</NavLink>
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
                <NavLink to="/create-product" onClick={toggleMenu} className={linkClass}>Create Product</NavLink>
                <NavLink to="/view-users" onClick={toggleMenu} className={linkClass}>View Users</NavLink>
                <NavLink to="/about" onClick={toggleMenu} className={linkClass}>About</NavLink>
                <NavLink to="/user-profile" onClick={toggleMenu} className={linkClass}>Profile</NavLink>
              </>
            )
          ) : (
            <NavLink to="/login" onClick={toggleMenu} className={linkClass}>Login</NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
