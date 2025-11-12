import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import apiInstance from "../config/apiInstance";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Form fade and scale in
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
        }
      );

      // Floating logo animation
      gsap.to(".forgot-logo", {
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 2.5,
      });
    });

    return () => ctx.revert();
  }, []);

  const onSubmit = async (data) => {
    try {
      let response = await apiInstance.post("/auth/forgot-Password", data);
      if (response) toast.success(response?.data?.message);
      navigate("/login");
    } catch (error) {
      let errorMessage =
        error?.response?.data?.message ||
        "Failed to send reset link, try again!";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* ✅ Floating Logo */}
      <img
        src="/myLogo.png"
        alt="ShopMaster Logo"
        className="forgot-logo h-28 sm:h-32 w-auto object-contain mb-6 drop-shadow-lg"
      />

      {/* ✅ Reset Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 transition-all duration-300 hover:shadow-2xl"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 text-sm sm:text-base">
          Enter your email address to receive a reset link.
        </p>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="sr-only">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className={`w-full pl-10 pr-3 py-2 sm:py-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all shadow-md active:scale-[0.98] duration-300"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Back to Login */}
        <p className="text-center text-gray-600 text-sm">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      </form>

      {/* ✅ Decorative background blur elements */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-purple-300 opacity-20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default ForgotPassword;
