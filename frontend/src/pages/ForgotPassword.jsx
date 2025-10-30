import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import apiInstance from '../apiInstance';

const ForgotPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            let response = await apiInstance.post("/auth/forgot-Password", data);
            if (response) {
                toast.success(response?.data?.message);
            }

            navigate("/login");
        } catch (error) {
            let errorMessage = error?.response?.data?.message || "filed forgot-password, try again!";
            toast.error(errorMessage);
            console.log(error);

        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-[350px] bg-white rounded-xl shadow-md p-6 space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>
                <p className="text-center text-gray-500 text-sm">
                    Enter your email address to receive a password reset link.
                </p>

                <div>
                    <label htmlFor="email" className="sr-only">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-sm transition"
                >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
