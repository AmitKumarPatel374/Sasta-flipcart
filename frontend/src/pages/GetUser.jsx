import React, { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Mail, Phone, Shield, Calendar, ArrowLeft } from "lucide-react"
import apiInstance from "../config/apiInstance"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const GetUser = () => {
  const { user_id } = useParams()
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const cardRef = useRef(null)

  const fetchUser = async () => {
    try {
      const response = await apiInstance.get(`/admin/get-user/${user_id}`)
      setUser(response.data.user)
    } catch (error) {
      console.error("Failed to fetch user:", error)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // ✅ GSAP Animations
  useEffect(() => {
    if (user) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".user-card",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        )

        gsap.fromTo(
          ".avatar",
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "back.out(1.7)",
            delay: 0.2,
          }
        )

        gsap.fromTo(
          ".info-item",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            delay: 0.4,
            ease: "power2.out",
          }
        )

        gsap.fromTo(
          ".action-btn",
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: 1.2,
            ease: "back.out(1.5)",
          }
        )
      }, cardRef)

      return () => ctx.revert()
    }
  }, [user])

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100">
        <p className="text-lg font-medium text-gray-600 animate-pulse">Loading user details...</p>
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 flex justify-center items-center px-4 py-10"
    >
      <div className="user-card relative bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl w-full max-w-2xl border border-gray-200 overflow-hidden">
        {/* Gradient Accent Circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 -right-10 w-56 h-56 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full blur-3xl opacity-20"></div>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
          <h1 className="text-2xl font-semibold tracking-wide text-center sm:text-left">
            User Details
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm bg-white text-blue-600 px-4 py-1.5 rounded-lg shadow-sm hover:bg-blue-50 transition-all"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Content */}
        <div className="p-8 relative z-10">
          {/* Profile Image */}
          <div className="flex flex-col items-center text-center">
            <div className="avatar w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center rounded-full text-4xl font-bold shadow-lg">
              {user.fullname?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-semibold mt-4 text-gray-800">{user.fullname}</h2>
            <p className="text-gray-500 text-sm">@{user.username}</p>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 text-sm sm:text-base">
            <div className="info-item flex items-center gap-3">
              <Mail className="text-indigo-500" />
              <div>
                <p className="text-gray-500 text-xs">Email</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="info-item flex items-center gap-3">
              <Phone className="text-green-500" />
              <div>
                <p className="text-gray-500 text-xs">Mobile</p>
                <p className="font-medium text-gray-800">{user.mobile || "N/A"}</p>
              </div>
            </div>

            <div className="info-item flex items-center gap-3">
              <Shield className="text-purple-500" />
              <div>
                <p className="text-gray-500 text-xs">Role</p>
                <p className="font-medium text-gray-800 capitalize">{user.role}</p>
              </div>
            </div>

            <div className="info-item flex items-center gap-3">
              <Calendar className="text-blue-500" />
              <div>
                <p className="text-gray-500 text-xs">Created At</p>
                <p className="font-medium text-gray-800">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="info-item flex items-center gap-3 sm:col-span-2">
              <Calendar className="text-blue-500" />
              <div>
                <p className="text-gray-500 text-xs">Last Updated</p>
                <p className="font-medium text-gray-800">
                  {new Date(user.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="action-btn bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-xl font-medium transition-all w-full sm:w-auto"
            >
              Back
            </button>
            <button className="action-btn bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all w-full sm:w-auto">
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GetUser
