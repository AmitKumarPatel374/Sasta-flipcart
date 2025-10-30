import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import apiInstance from "../apiInstance";

const CreateProduct = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const [images, setImages] = useState([]);



    const onSubmit = async (data) => {
        try {
            let formData = new FormData();

            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("amount", data.amount);
            formData.append("currency", data.currency);

            images.forEach((image) => {
                formData.append("images", image);
            })
            let response = await apiInstance.post("/product/create-product", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            if (response) {
                toast.success(response?.data?.message);
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "creation failed. Please try again.";
            toast.error(errorMessage);
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
                encType="multipart/form-data"
            >
                <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                    Create Product
                </h2>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        {...register("title", { required: "Title is required" })}
                        className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product title"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        {...register("description", {
                            required: "Description is required",
                        })}
                        rows={3}
                        className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Product description"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Price Amount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (Amount)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("amount", { required: "Amount is required" })}
                        className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter price"
                    />
                    {errors.amount && (
                        <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
                    )}
                </div>

                {/* Currency */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                    </label>
                    <select
                        {...register("currency", { required: true })}
                        className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="INR">INR</option>
                        <option value="DOLLAR">DOLLAR</option>
                    </select>
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Images
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setImages(Array.from(e.target.files))}
                        className="w-full border px-3 py-2 rounded-md text-sm"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-sm transition"
                >
                    {isSubmitting ? "Creating..." : "Create Product"}
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;
