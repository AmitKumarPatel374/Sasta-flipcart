import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import apiInstance from '../config/apiInstance';
import { RegisterUserHook } from "../hooks/AuthHooks";

const RegistrationForm = () => {
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const mutation = RegisterUserHook();

  const onSubmit = async (data) => {
     try {
      const response = await apiInstance.post("/auth/register", data);
      if (response) toast.success(response?.data?.message);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed.");
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
    window.location.href = googleAuthUrl;
  };

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.5, ease: "easeIn" } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 p-6 overflow-hidden"
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 px-4">
        {/* LEFT IMAGE SIDE */}
        <div className="hidden md:block relative">
          <img
            src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?semt=ais_hybrid&w=740&q=80"
            alt="hero"
            className="w-full h-full object-cover rounded-l-none rounded-r-3xl"
          />
        </div>

        {/* RIGHT FORM SIDE */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="flex justify-center items-center gap-3 mb-6">
              <img className="h-20" src="/myLogo.png" alt="" />
            </div>
            <p className="text-gray-500 mb-6 text-center">
              Create your new account and get started
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* FULL NAME */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  {...register("fullname", { required: "Full name is required" })}
                  placeholder="Full Name"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-300 ${errors.fullname ? "border-red-500" : "border-gray-200"}`}
                />
              </div>

              {/* USERNAME */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  {...register("username", { required: "Username is required" })}
                  placeholder="Username"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-300 ${errors.username ? "border-red-500" : "border-gray-200"}`}
                />
              </div>

              {/* EMAIL */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  placeholder="Email"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-300 ${errors.email ? "border-red-500" : "border-gray-200"}`}
                />
              </div>

              {/* MOBILE */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  maxLength={10}
                  {...register("mobile", {
                    required: "Mobile number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" },
                  })}
                  placeholder="Mobile Number"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-300 ${errors.mobile ? "border-red-500" : "border-gray-200"}`}
                />
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  placeholder="Password"
                  className={`w-full pl-3 pr-10 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-300 ${errors.password ? "border-red-500" : "border-gray-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* ROLE */}
              <div>
                <select
                  {...register("role", { required: "Role is required" })}
                  defaultValue=""
                  className={`w-full px-3 py-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-purple-300 ${errors.role ? "border-red-500" : "border-gray-200"}`}
                >
                  <option value="" disabled>Select Role</option>
                  <option value="user">User</option>
                  <option value="seller">Seller</option>
                </select>
              </div>

              {/* GOOGLE SIGNUP */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-md text-sm flex items-center justify-center gap-2 transition"
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                Sign up with Google
              </button>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-300 to-indigo-500 text-white font-semibold py-2 rounded-md text-sm transition"
              >
                {isSubmitting ? "Submitting..." : "Sign Up"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegistrationForm;
