import { usercontext } from "../context/DataContext"
import React, { useState, useRef, useEffect, useContext } from "react"

const NavbarFilter = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const [mobileMenu, setMobileMenu] = useState(null)
  const dropdownRef = useRef(null)

  const isMobile = window.innerWidth < 1024

  const {categories}=useContext(usercontext);

  useEffect(() => {
    if (isMobile) return
    if (openIndex === null) return

    const menu = dropdownRef.current
    if (!menu) return

    const rect = menu.getBoundingClientRect()

    if (rect.right > window.innerWidth) {
      menu.style.left = "auto"
      menu.style.right = "0px"
    } else {
      menu.style.left = "0px"
      menu.style.right = "auto"
    }
  }, [openIndex])

  return (
    <div className="w-full bg-white shadow relative">
      {/* TOP NAV */}
      <ul className="flex justify-around px-2 md:px-8 py-4 flex-wrap gap-5 bg-gray-100  text-sm md:text-base">
        {categories && categories.map((cat, index) => (
          <li
            key={index}
            className="relative cursor-pointer "
            onMouseEnter={() => !isMobile && setOpenIndex(index)}
            onMouseLeave={() => !isMobile && setOpenIndex(null)}
            onClick={() => isMobile && setMobileMenu(index)}
          >
            <span className="hover:text-blue-600">{cat.name}</span>

            {/* DESKTOP MEGA MENU */}
            {!isMobile && openIndex === index && (
              <div
                ref={dropdownRef}
                className="absolute top-full bg-white shadow-xl border rounded-md p-5 z-50 min-w-[700px] bg-gradient-to-br from-gray-100 via-white to-blue-100"
              >
                <div className="flex flex-wrap gap-10 max-w-[90vw]">
                  {cat.sub.map((sub, i) => (
                    <div
                      key={i}
                      className="w-[180px]"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2">{sub.title}</h4>
                      <ul className="space-y-1">
                        {sub.items.map((item, j) => (
                          <li
                            key={j}
                            className="text-gray-600 text-sm hover:text-blue-500"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* MOBILE FULL SCREEN MENU */}
      {isMobile && mobileMenu !== null && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 p-4 overflow-y-auto">
          <button
            className="mb-4 p-2 bg-gray-200 rounded"
            onClick={() => setMobileMenu(null)}
          >
            Close ✖
          </button>

          <h2 className="text-lg font-bold mb-4">{categories[mobileMenu].name}</h2>

          <div className="flex flex-wrap gap-6">
            {categories[mobileMenu].sub.map((sub, i) => (
              <div
                key={i}
                className="w-[48%] bg-gray-50 p-3 rounded"
              >
                <h3 className="font-semibold mb-2">{sub.title}</h3>
                <ul className="text-sm space-y-1">
                  {sub.items.map((item, j) => (
                    <li className="hover:text-blue-500" key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NavbarFilter



