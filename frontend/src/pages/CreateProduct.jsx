import React, { useContext, useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import apiInstance from "../config/apiInstance";
import { useNavigate } from "react-router-dom";
import { usercontext } from "../context/DataContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const { user_id } = useContext(usercontext);
  const [images, setImages] = useState([]);
  const formRef = useRef(null);

  // ✅ GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".form-wrapper",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );

      gsap.fromTo(
        ".input-field",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.4,
        }
      );

      gsap.fromTo(
        ".submit-btn",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 1.2,
        }
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  // ✅ Submit Product
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

      const response = await apiInstance.post(
        "/product/create-product",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(response?.data?.message || "Product created successfully!");
      reset();
      setImages([]);
      navigate(`/view-seller-products/${user_id}`);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Product creation failed!";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <div
      ref={formRef}
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-200 via-white to-blue-100"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="form-wrapper bg-gradient-to-br from-gray-300 via-white to-blue-200 shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-5xl border border-gray-300"
      >
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Create New Product
        </h2>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="input-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter product title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Brand */}
          <div className="input-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              {...register("brand", { required: "Brand is required" })}
              className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter brand name"
            />
            {errors.brand && (
              <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2 input-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description", { required: "Description is required" })}
              rows={3}
              className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none resize-none"
              placeholder="Product description"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="input-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MRP
            </label>
            <input
              type="number"
              {...register("MRP", { required: "MRP is required" })}
              className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter MRP"
            />
          </div>

          <div className="input-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price
            </label>
            <input
              type="number"
              {...register("amount", { required: "Amount is required" })}
              className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter amount"
            />
          </div>

          <div className="input-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              {...register("currency", { required: true })}
              className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="INR">INR</option>
              <option value="DOLLAR">DOLLAR</option>
            </select>
          </div>

          {/* Color */}
          <div className="input-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="text"
              {...register("color", { required: "Color is required" })}
              className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter product color"
            />
          </div>

          {/* Size */}
          <div className="input-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <input
              type="text"
              {...register("size")}
              className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter size (optional)"
            />
          </div>

          {/* Offer & Warranty */}
          <div className="input-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Offer
            </label>
            <input
              type="text"
              {...register("specialOffer")}
              className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="e.g. Buy 1 Get 1 Free"
            />
          </div>

          <div className="input-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warranty
            </label>
            <input
              type="text"
              {...register("warrenty", { required: "Warranty is required" })}
              className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="e.g. 1 year manufacturer warranty"
            />
          </div>

          {/* Specifications */}
          <div className="md:col-span-2 input-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specifications
            </label>
            <textarea
              {...register("specifications", {
                required: "Specifications are required",
              })}
              rows={3}
              className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none resize-none"
              placeholder="Enter key specifications"
            />
            {errors.specifications && (
              <p className="text-red-500 text-xs mt-1">
                {errors.specifications.message}
              </p>
            )}
          </div>

          {/* Images */}
          <div className="md:col-span-2 input-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files))}
              className="w-full border-2 border-dashed border-gray-400 px-3 py-2 rounded-md text-sm bg-white"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-btn w-full mt-10 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md text-sm sm:text-base transition-all"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
