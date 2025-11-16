import React, { useContext, useState, useEffect, useRef } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { usercontext } from "../context/DataContext"
import { Menu, X, Search } from "lucide-react"
import gsap from "gsap"

const Nav = () => {
  const { token, role, user_id } = useContext(usercontext)
  const isUser = role === "user"
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const searchHandler = () => {
    if (!searchValue.trim()) return;

    navigate(`/search/${searchValue}`)
  }

  const menuRef = useRef(null)
  const searchRef = useRef(null)

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const toggleSearch = () => setMobileSearchOpen(!mobileSearchOpen)

  // GSAP animation for mobile menu
  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(menuRef.current, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.35 })
    }
  }, [menuOpen])

  // GSAP animation for mobile search dropdown
  useEffect(() => {
    if (mobileSearchOpen) {
      gsap.fromTo(searchRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 })
    }
  }, [mobileSearchOpen])

  const linkClass = ({ isActive }) =>
    `transition font-medium ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`

  return (
    <nav className="bg-gray-200 h-20 px-6 py-3 flex items-center justify-between relative border-b border-gray-300">
      {/* ---------------- LEFT SIDE: LOGO ---------------- */}
      <NavLink
        to="/"
        className="flex items-center"
      >
        <img
          src="/myLogo.png"
          alt="ShopMaster Logo"
          className="h-14 w-auto"
        />
      </NavLink>
      {/* ----------- SPACE BETWEEN LOGO & SEARCH ------------ */}
      <div className="hidden md:flex flex-1"></div> {/* THIS CREATES THE SPACE */}
      {/* ---------------- SEARCH BAR (DESKTOP) ---------------- */}
      <div className="hidden md:flex items-center w-[280px] bg-white rounded-full px-4 py-2 shadow-sm border mx-4">
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchHandler()}
          type="text"
          placeholder="Search products..."
          className="w-full px-3 outline-none text-gray-700"
        />
        <button
          onClick={searchHandler}
          className="cursor-pointer"
        >
          <Search
            size={18}
            className="text-gray-600"
          />
        </button>
      </div>
      {/* ---------------- RIGHT SIDE MENU (DESKTOP) ---------------- */}
      <div className="hidden md:flex gap-6 items-center">
        <NavLink
          to="/"
          className={linkClass}
        >
          Home
        </NavLink>

        <NavLink
          to="/view-all-product"
          className={linkClass}
        >
          Products
        </NavLink>

        <NavLink
          to="/about"
          className={linkClass}
        >
          About
        </NavLink>

        {token ? (
          <NavLink
            to="/user-profile"
            className={linkClass}
          >
            Profile
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className={linkClass}
          >
            Login
          </NavLink>
        )}
      </div>
      {/* ---------------- MOBILE ICONS ---------------- */}
      <div className="flex md:hidden gap-4 items-center">
        {/* Mobile Search Icon */}
        <button
          onClick={toggleSearch}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          <Search size={26} />
        </button>

        {/* Menu Icon */}
        <button
          onClick={toggleMenu}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
      {/* ---------------- MOBILE SEARCH DROPDOWN ---------------- */}
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
            <button
              onClick={searchHandler}
              className="cursor-pointer"
            >
              <Search
                size={20}
                className="text-gray-600"
              />
            </button>
          </div>
        </div>
      )}
      {/* ---------------- MOBILE MENU ---------------- */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 w-full bg-gray-300 flex flex-col 
          items-start gap-4 p-4 border-t border-gray-400 md:hidden z-50"
        >
          <NavLink
            to="/"
            onClick={toggleMenu}
            className={linkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/view-all-product"
            onClick={toggleMenu}
            className={linkClass}
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            onClick={toggleMenu}
            className={linkClass}
          >
            About
          </NavLink>

          {token ? (
            <NavLink
              to="/user-profile"
              onClick={toggleMenu}
              className={linkClass}
            >
              Profile
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              onClick={toggleMenu}
              className={linkClass}
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  )
}

export default Nav
