import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import apiInstance from "../apiInstance";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();
    const navigate=useNavigate();

    const [images, setImages] = useState([]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("brand", data.brand);
            formData.append("description", data.description);
            formData.append("color", data.color);
            formData.append("size", data.size);
            formData.append("specialOffer", data.specialOffer);
            formData.append("warrenty", data.warrenty);
            formData.append("specifications", data.specifications);

            const price = {
                MRP: data.MRP,
                amount: data.amount,
                currency: data.currency,
            };
            formData.append("price", JSON.stringify(price));

            images.forEach((img) => formData.append("images", img));

            const response = await apiInstance.post("/product/create-product", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            navigate("/view-all-product");
            if (response) {
                toast.success(response?.data?.message || "Product created successfully!");
                reset();
                setImages([]);
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Product creation failed!";
            toast.error(errorMessage);
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
            <form
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Create New Product
                </h2>

                {/* Two Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            {...register("title", { required: "Title is required" })}
                            className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter product title"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input
                            type="text"
                            {...register("brand", { required: "Brand is required" })}
                            className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter brand name"
                        />
                        {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            rows={3}
                            className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Product description"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* MRP */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
                        <input
                            type="number"
                            {...register("MRP", { required: "MRP is required" })}
                            className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter MRP"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                        <input
                            type="number"
                            {...register("amount", { required: "Amount is required" })}
                            className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter amount"
                        />
                    </div>

                    {/* Currency */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <select
                            {...register("currency", { required: true })}
                            className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="INR">INR</option>
                            <option value="DOLLAR">DOLLAR</option>
                        </select>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <input
                            type="text"
                            {...register("color", { required: "Color is required" })}
                            className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter product color"
                        />
                    </div>

                    {/* Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                        <input
                            type="text"
                            {...register("size")}
                            className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter size (optional)"
                        />
                    </div>

                    {/* Special Offer */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Offer</label>
                        <input
                            type="text"
                            {...register("specialOffer")}
                            className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Buy 1 Get 1 Free"
                        />
                    </div>

                    {/* Warranty */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
                        <input
                            type="text"
                            {...register("warrenty", { required: "Warranty is required" })}
                            className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. 1 year manufacturer warranty"
                        />
                    </div>

                    {/* Specifications */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                        <textarea
                            {...register("specifications", { required: "Specifications are required" })}
                            rows={3}
                            className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter key specifications"
                        />
                    </div>

                    {/* Images */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setImages(Array.from(e.target.files))}
                            className="w-full border px-3 py-2 rounded-md text-sm"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-sm transition"
                >
                    {isSubmitting ? "Creating..." : "Create Product"}
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;
