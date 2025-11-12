import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import apiInstance from '../config/apiInstance';
import { useNavigate } from "react-router-dom";
import { usercontext } from "../context/DataContext";
import { toast } from "react-toastify";

const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { role } = useContext(usercontext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiInstance.get("/product/get-products");
        setProducts(response.data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    try {
      const response = await apiInstance.delete(`/admin/delete-product/${id}`);
      setProducts((prevProducts) => prevProducts.filter((p) => p._id !== id));
      toast.success(response.data.message);
    } catch (error) {
      console.log("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          Loading products...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-10 text-center text-gray-800 tracking-wide">
        🛍️ All Products
      </h1>

      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id || product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between border border-gray-200"
            >
              {/* 🖼️ Product Image */}
              <div className="relative w-full h-56 sm:h-64 lg:h-72 overflow-hidden rounded-t-2xl border-b">
                {product.images.length > 1 ? (
                  <Slider {...sliderSettings} className="w-full h-full">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className="flex justify-center items-center h-56 sm:h-64 lg:h-72 bg-white"
                      >
                        <img
                          src={image}
                          alt={product.title}
                          className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-full w-full object-contain transition-transform duration-300 hover:scale-105 bg-white"
                  />
                )}

                {/* 🔖 Discount Badge */}
                {product.price &&
                  ((product.price.MRP - product.price.amount) /
                    product.price.MRP) *
                    100 >
                    0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                      {(
                        ((product.price.MRP - product.price.amount) /
                          product.price.MRP) *
                        100
                      ).toFixed(0)}
                      % OFF
                    </div>
                  )}
              </div>

              {/* 🧾 Product Info */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow text-center">
                <h2 className="text-base sm:text-lg font-semibold mb-1 text-gray-800 truncate">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2 font-medium truncate">
                  Brand: {product.brand}
                </p>

                {/* 💰 Price Info */}
                <div className="flex justify-center items-center gap-2 mb-3">
                  <span className="text-gray-500 line-through text-xs sm:text-sm">
                    {product.price.currency} {product.price.MRP}
                  </span>
                  <span className="text-green-600 text-sm sm:text-lg font-bold">
                    {product.price.currency} {product.price.amount}
                  </span>
                </div>

                {/* 🏷️ Discount Info */}
                {product.price?.discount > 0 && (
                  <p className="text-xs text-gray-600">
                    You save{" "}
                    <span className="text-green-600 font-semibold">
                      {(
                        ((product.price.MRP - product.price.amount) /
                          product.price.MRP) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  </p>
                )}

                {/* Buttons */}
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => navigate(`/detail/${product._id}`)}
                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
                  >
                    👁️ View Details
                  </button>
                  {role === "seller" && (
                    <button
                      onClick={() => deleteHandler(product._id)}
                      className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-red-500 transition cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 font-semibold text-lg py-10">
          ❌ Products Not Found
        </div>
      )}

      {/* Custom Slider Dots Style */}
      <style>{`
        .slick-dots {
          bottom: 8px;
        }
        .slick-dots li button:before {
          color: #2563eb;
          font-size: 10px;
          opacity: 0.7;
        }
        .slick-dots li.slick-active button:before {
          opacity: 1;
          color: #1e40af;
        }
      `}</style>
    </div>
  );
};

export default ViewAllProducts;
