import { useState, useEffect, useContext, useRef } from "react"
import apiInstance from "../config/apiInstance"
import { useNavigate } from "react-router-dom"
import { Mail, Phone, Shield } from "lucide-react"
import { usercontext } from "../context/DataContext"
import { toast } from "react-toastify"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { setToken, setRole } = useContext(usercontext)
  const profileRef = useRef(null)

  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await apiInstance.get("/auth/profile", {
        withCredentials: true,
      })
      setUser(response.data.user || response.data)
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch profile")
      if (error.response?.status === 401) navigate("/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // GSAP Animations
  useEffect(() => {
    if (user) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".profile-wrapper",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
        )

        gsap.fromTo(
          ".profile-img",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1.2, delay: 0.3, ease: "back.out(1.6)" }
        )

        gsap.fromTo(
          ".profile-detail",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.5,
            stagger: 0.15,
            ease: "power2.out",
          }
        )

        gsap.utils.toArray(".btn-animate").forEach((btn) => {
          btn.addEventListener("mouseenter", () => {
            gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "power2.out" })
          })
          btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" })
          })
        })
      }, profileRef)

      return () => ctx.revert()
    }
  }, [user])

  // Logout
  const logoutHandler = async () => {
    try {
      const response = await apiInstance.delete("/auth/logout")
      setToken(false)
      setRole(null)
      toast.success(response.data.message)
      navigate("/login")
    } catch (error) {
      console.log("Error in logout ->", error)
    }
  }

  // Loading / Error States
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <p className="text-lg font-medium text-gray-600 animate-pulse">Loading your profile...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    )

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <p className="text-gray-700 font-medium">Please log in to view your profile.</p>
      </div>
    )

  return (
    <div
      ref={profileRef}
      className="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-10 relative overflow-hidden"
    >
      {/* Soft glowing static background shapes (no animation now) */}
      <div className="absolute top-10 left-16 w-56 h-56 bg-gray-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-20"></div>

      {/* Main Profile Container */}
      <div className="profile-wrapper bg-gradient-to-br from-gray-300 via-white to-blue-200 relative bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-2xl border border-gray-200 transition-all duration-500 hover:shadow-indigo-200/70">
        <div className="flex flex-col items-center relative z-10 space-y-4">
          {/* Profile Image */}
          {user.profileLogo ? (
            <img
              src={user.profileLogo}
              alt="Profile"
              className="profile-img w-32 h-32 rounded-full object-cover border-[3px] border-indigo-500 shadow-md"
            />
          ) : (
            <div className="profile-img w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user.fullname?.[0]?.toUpperCase()}
            </div>
          )}

          {/* Name */}
          <h2 className="profile-detail text-3xl font-bold text-gray-800 leading-tight">
            {user.fullname}
          </h2>
          <p className="profile-detail text-gray-500 text-sm sm:text-base -mt-1">
            @{user.username}
          </p>

          {/* Role Tag */}
          <span className="profile-detail mt-1 inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-sm">
            {user.role === "seller" ? "Seller" : "User"}
          </span>

          {/* Divider */}
          <div className="profile-detail h-[1px] w-24 bg-gradient-to-r from-indigo-400 to-purple-400 my-6"></div>

          {/* User Info */}
          <div className="w-full text-left space-y-5">
            <div className="profile-detail flex items-center gap-3 border-b pb-3 border-gray-200">
              <Mail
                className="text-indigo-500 min-w-[20px]"
                size={20}
              />
              <span className="text-gray-700 font-medium text-sm sm:text-base">{user.email}</span>
            </div>
            <div className="profile-detail flex items-center gap-3 border-b pb-3 border-gray-200">
              <Phone
                className="text-green-500 min-w-[20px]"
                size={20}
              />
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                {user.mobile || "Not provided"}
              </span>
            </div>
            <div className="profile-detail flex items-center gap-3">
              <Shield
                className="text-purple-500 min-w-[20px]"
                size={20}
              />
              <span className="capitalize text-gray-700 font-medium text-sm sm:text-base">
                {user.role}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={() => navigate("/update-user-profile")}
              className="btn-animate w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-300/50 transition-all duration-300"
            >
              Update Profile
            </button>

            <button
              onClick={logoutHandler}
              className="btn-animate w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-300/50 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
