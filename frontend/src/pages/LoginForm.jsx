import React, { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import { Mail, Eye, EyeOff } from "lucide-react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { usercontext } from "../context/DataContext"
import apiInstance from "../config/apiInstance"
import { motion } from "framer-motion"

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()
  const { setToken, setRole, setContact } = useContext(usercontext)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data) => {
    try {
      let response = await apiInstance.post("/auth/login", data)
      if (response?.status === 200) {
        toast.success(response?.data?.message || "OTP sended please verify!")

        setContact(data.contact)
        navigate("/verify-otp")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "otp sended failed.")
    }
  }

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${import.meta.env.VITE_SERVER_URL}/auth/google`
    window.location.href = googleAuthUrl
  }

  const handleFacebookLogin = () => {
    const facebookAuthUrl = `${import.meta.env.VITE_SERVER_URL}/auth/facebook`
    window.location.href = facebookAuthUrl
  }

  const pageVariants = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5, ease: "easeIn" } },
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 p-6 overflow-hidden"
    >
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 px-4">
        {/* LEFT FORM SIDE */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="flex justify-center items-center gap-3 mb-6">
              <img
                className="h-20"
                src="/myLogo.png"
                alt=""
              />
            </div>
            <p className="text-gray-500 mb-6 text-center">
              Welcome back! Please enter your details
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* contact */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Mobile
                </label>
                <input
                  type="text"
                  {...register("contact", {
                    required: "Email or mobile number is required",
                    validate: (value) => {
                      const emailRegex = /^\S+@\S+\.\S+$/
                      const phoneRegex = /^[0-9]{10}$/
                      if (emailRegex.test(value)) return true
                      if (phoneRegex.test(value)) return true
                      return "Enter a valid email or 10-digit mobile number"
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 ${
                    errors.contact ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter email or phone"
                />
                {errors.contact && (
                  <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  placeholder="Enter your password"
                  className={`w-full pl-3 pr-10 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-300 ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-orange-300 to-indigo-500 text-white font-semibold py-2 rounded-md text-sm transition"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>

              {/* SOCIAL */}
              <div className="flex items-center my-3">
                <div className="h-px bg-gray-200 flex-1" />
                <div className="px-3 text-xs text-gray-400">Or Continue With</div>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-3 border border-gray-200 bg-white text-gray-700 font-medium py-2 rounded-md text-sm hover:bg-gray-50 transition"
                >
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Google
                </button>

                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="flex items-center justify-center gap-3 border border-gray-200 bg-white text-gray-700 font-medium py-2 rounded-md text-sm hover:bg-gray-50 transition"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="#1877F2"
                  >
                    <path d="M22 12.073C22 6.48 17.523 2 12 2S2 6.48 2 12.073C2 17.086 5.656 21.128 10.438 21.996V14.89h-2.9v-2.817h2.9V9.356c0-2.865 1.7-4.444 4.303-4.444 1.247 0 2.553.223 2.553.223v2.806h-1.437c-1.417 0-1.857.881-1.857 1.785v2.132h3.164l-.506 2.817h-2.658v7.105C18.344 21.128 22 17.086 22 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>

              {/* REGISTER LINK */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT IMAGE SIDE */}
        <div className="hidden md:block relative">
          <img
            src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?semt=ais_hybrid&w=740&q=80"
            alt="hero"
            className="w-full h-full object-cover rounded-l-none rounded-r-3xl"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default LoginForm
