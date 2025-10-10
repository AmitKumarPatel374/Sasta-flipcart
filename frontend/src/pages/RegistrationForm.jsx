import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, Send, Eye, EyeOff } from "lucide-react";
import { useContext } from "react";
import { usercontext } from "../context/DataContext";
import { toast } from "react-toastify";
import axios from "axios";

const RegistrationForm = ({ setTogggle }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.post("http://localhost:3000/api/auth/register", data);
            if (response) {
                toast.success(response?.data?.message);
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "registration failed. Please try again.";
            toast.error(errorMessage);
            console.log(error);

        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "https://your-backend.com/auth/google"; // Replace with actual route
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-[350px] bg-white rounded-xl shadow-md p-6 space-y-4"
            >
                {/* Header */}
                <div className="text-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-800">Register</h1>
                    <p className="text-sm text-gray-500">Create your account</p>
                </div>

                {/* Full Name */}
                <div>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            {...register("fullname", { required: "Full name is required" })}
                            placeholder="Full Name"
                            className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullname ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                    </div>
                    {errors.fullname && (
                        <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>
                    )}
                </div>

                {/* Username */}
                <div>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            {...register("username", { required: "Username is required" })}
                            placeholder="Username"
                            className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.userName ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                    </div>
                    {errors.userName && (
                        <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email",
                                },
                            })}
                            placeholder="Email"
                            className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Mobile */}
                <div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="tel"
                            maxLength={10}
                            {...register("mobile", {
                                required: "Mobile is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Must be 10 digits",
                                },
                            })}
                            placeholder="Mobile"
                            className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.mobile ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                    </div>
                    {errors.mobile && (
                        <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password", { required: "Password is required" })}
                            placeholder="Password"
                            className={`w-full pl-10 pr-10 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Role */}
                <div>
                    <select
                        {...register("role", { required: "Role is required" })}
                        defaultValue="user"
                        className={`w-full px-3 py-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role ? "border-red-500" : "border-gray-300"
                            }`}
                    >
                        <option value="user">User</option>
                        <option value="seller">Seller</option>
                    </select>
                    {errors.role && (
                        <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
                    )}
                </div>

                {/* Google Login */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-md text-sm flex items-center justify-center gap-2"
                >
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        className="w-4 h-4"
                    />
                    Sign up with Google
                </button>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-sm transition"
                >
                    {isSubmitting ? "Submitting..." : "Sign Up"}
                </button>

                {/* Navigate to Login */}
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => setTogggle((prev) => !prev)}
                        className="text-blue-500 hover:underline"
                    >
                        Login
                    </button>
                </p>
            </form>
        </div>
    );
};

export default RegistrationForm;
