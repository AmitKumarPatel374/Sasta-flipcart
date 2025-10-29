import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/product/get-products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products);
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



  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">All Products</h1>

        {products.map((product) => (
          <div key={product._id || product.id} className="p-3">
            <div className="border rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition bg-white">
              {
                product.images.map((image) => {
                  <img
                    src={image}
                    alt={product.title}
                    className="w-full h-56 object-cover"
                  />
                })
              }
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1 truncate">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-green-700 font-bold">
                  {product.currency} {product.amount}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ViewAllProducts;
