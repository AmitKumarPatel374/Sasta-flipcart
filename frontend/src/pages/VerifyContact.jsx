import React, { useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "react-toastify";
import apiInstance from "../config/apiInstance";
import { usercontext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const VerifyContact = () => {
  const [otp, setOtp] = useState("");
  const { setToken, setRole, contact } = useContext(usercontext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".otp-hero",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.2 }
      );

      gsap.to(".otp-icon", {
        y: -8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 2.5,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await apiInstance.post("/auth/verify-otp", { contact, otp });
      if (response?.status === 200) {
        toast.success(response?.data?.message || "OTP verified successfully!");
        setToken(true);
        setRole(response.data.user.role);
        navigate("/");
      }
    } catch (err) {
      console.log("Error in OTP verification →", err);
      toast.error(err?.response?.data?.message || "OTP verification failed.");
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 text-gray-800 px-6 py-12"
    >
      {/* Floating Icon */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="otp-icon bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-full p-4 mb-4 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v3.75m9 0H7.5m9 0v7.5A2.25 2.25 0 0114.25 21h-4.5A2.25 2.25 0 017.5 18v-7.5m9 0H7.5"
            />
          </svg>
        </div>
        <h2 className="otp-hero text-3xl sm:text-4xl font-bold mb-2">
          Verify Your Email
        </h2>
        <p className="otp-hero text-gray-600 max-w-md">
          We’ve sent a 6-digit OTP to <span className="font-semibold">{contact}</span>.
          Please enter it below to complete your login.
        </p>
      </div>

      {/* OTP Form */}
      <form
        onSubmit={handleVerify}
        className="otp-hero bg-white shadow-xl rounded-3xl p-8 w-full max-w-md border border-gray-200"
      >
        <label className="block text-sm font-medium text-gray-600 mb-3">
          Enter OTP
        </label>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit code"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none tracking-widest text-center text-xl font-semibold text-gray-700"
        />

        <button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-indigo-300/50 transform hover:-translate-y-1 transition duration-300"
        >
          Verify OTP
        </button>

        <div className="text-center mt-4 text-sm text-gray-500">
          Didn’t receive the code?{" "}
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Resend OTP
          </span>
        </div>
      </form>
    </div>
  );
};

export default VerifyContact;
