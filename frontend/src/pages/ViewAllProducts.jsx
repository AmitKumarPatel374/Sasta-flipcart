import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import apiInstance from "../apiInstance";

const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="px-6 py-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800 tracking-wide">
        🛍️ All Products
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id || product.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between border border-black-200"
          >
            {/* 🖼️ Image Section */}
            <div className="relative w-full h-64 border-b rounded-t-2xl flex items-center  overflow-hidden">
              {product.images.length > 1 ? (
                <Slider {...sliderSettings} className="w-full h-full">
                  {product.images.map((image, index) => (
                    <div key={index} className="flex justify-center items-center mt-15 h-64">
                      <img
                        src={image}
                        alt={product.title}
                        className="max-h-64 object-contain mx-auto transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="max-h-64 object-contain mx-auto transition-transform duration-300 hover:scale-105"
                />
              )}
            </div>

            {/* 🧾 Product Info */}
            <div className="p-5 flex flex-col flex-grow text-center">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 truncate">
                {product.title}
              </h2>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="mt-auto">
                <p className="text-green-600 text-xl font-bold mb-3">
                  {product.price.currency} {product.price.amount}
                </p>

                <div className="flex justify-center gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
          color: #1e40af; /* Tailwind blue-800 */
        }
      `}</style>
    </div>
  );
};

export default ViewAllProducts;
