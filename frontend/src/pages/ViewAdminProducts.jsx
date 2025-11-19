import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import apiInstance from '../config/apiInstance';
import { useNavigate, useParams } from "react-router-dom";
import { usercontext } from "../context/DataContext";
import { toast } from "react-toastify";

const ViewAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { role } = useContext(usercontext);
  const { user_id } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiInstance.get(`/admin/get-Your-products/${user_id}`);
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
      console.log("error in deleting->", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

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
    <div className="px-4 sm:px-6 py-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-800 tracking-wide">
        🛍️ All Products
      </h1>

      {products && products.length > 0 ? (
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              onClick={() => navigate(`/detail/${product._id}`)}
              key={product._id || product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between border border-gray-200"
            >
              {/* 🖼️ Image Section */}
              <div className="relative w-full h-56 sm:h-64 border-b rounded-t-2xl overflow-hidden">
                {product.images.length > 1 ? (
                  <Slider {...sliderSettings} className="w-full h-full">
                    {product.images.map((image, index) => (
                      <div key={index} className="flex justify-center items-center h-56 sm:h-64">
                        <img
                          src={image}
                          alt={product.title}
                          className="h-full w-full object-contain mx-auto transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-full w-full object-contain mx-auto transition-transform duration-300 hover:scale-105"
                  />
                )}

                {/* 🔖 Discount Badge */}
                {product.price &&
                  ((product.price.MRP - product.price.amount) / product.price.MRP) * 100 > 0 && (
                    <div className="absolute top-3 sm:top-5 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                      {(
                        ((product.price.MRP - product.price.amount) / product.price.MRP) *
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
                <p className="text-xs sm:text-sm text-gray-500 mb-2 font-medium">
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

                {/* 🏷️ Discount info */}
                {product.price?.discount > 0 && (
                  <p className="text-xs text-gray-600">
                    You save{" "}
                    <span className="text-green-600 font-semibold">
                      {(
                        ((product.price.MRP - product.price.amount) / product.price.MRP) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  </p>
                )}

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 font-semibold text-base sm:text-lg py-10">
          ❌ Products Not Found
        </div>
      )}

      <style>{`
        .slick-dots {
          bottom: 10px;
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

export default ViewAdminProducts;
