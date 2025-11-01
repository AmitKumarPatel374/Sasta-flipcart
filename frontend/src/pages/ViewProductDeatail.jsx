import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import apiInstance from "../apiInstance";
import { usercontext } from "../context/DataContext";

const ViewProductDetail = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const navigate=useNavigate();

  const { role } = useContext(usercontext)

  const fetchProductDetail = async () => {
    try {
      const response = await apiInstance.get(`/product/product-detail/${product_id}`);
      setProduct(response.data.product);
      setMainImage(response.data.product.images?.[0] || "");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-blue-500 animate-pulse">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Product not found.
      </div>
    );
  }

  const {
    _id,
    title,
    brand,
    description,
    color,
    size,
    warrenty,
    specialOffer,
    specifications,
    price,
    images,
  } = product;
  console.log(_id);
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-10 p-8 md:p-10">
        {/* Left Section: Product Images */}
        <div className="flex flex-col items-center">
          {/* Main Image */}
          <div className="relative w-full h-96 bg-gray-50 border rounded-2xl shadow-inner flex justify-center items-center overflow-hidden group">
            <img
              src={mainImage}
              alt={title}
              className="w-[90%] object-contain transform transition-transform duration-300 group-hover:scale-105"
            />
            {price?.discount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-semibold rounded-lg shadow-md">
                {price.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="flex mt-5 gap-3 flex-wrap justify-center">
            {images?.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setMainImage(img)}
                className={`h-20 w-20 object-contain border-2 rounded-lg cursor-pointer p-1 transition-all duration-300 hover:scale-105 ${mainImage === img ? "border-blue-500 shadow-md" : "border-gray-200"
                  }`}
                alt={`product-${index}`}
              />
            ))}
          </div>
        </div>

        {/* Right Section: Product Info */}
        <div className="flex flex-col gap-5 justify-between">
          {/* Title and Brand */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {title}
            </h1>
            <p className="text-gray-500 text-lg">
              Brand: <span className="font-semibold text-gray-700">{brand}</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed text-base border-l-4 border-blue-500 pl-4">
            {description}
          </p>

          {/* Price Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-2xl shadow-sm flex flex-col gap-2">
            <div className="text-3xl font-bold text-green-600">
              ₹{price?.amount}
            </div>
            <div className="text-gray-500 line-through text-sm">
              ₹{price?.MRP}
            </div>
            <div className="text-blue-600 font-semibold text-sm">
              Save ₹{price?.MRP - price?.amount} ({(((price?.MRP - price?.amount) / price?.MRP) * 100).toFixed(0)}% OFF)
            </div>
            <p className="text-xs text-gray-500">
              Currency: {price?.currency}
            </p>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-y-3 text-gray-700">
            <p>
              <span className="font-semibold">Color:</span> {color}
            </p>
            <p>
              <span className="font-semibold">Size:</span> {size || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Warranty:</span> {warrenty}
            </p>
            <p>
              <span className="font-semibold">Special Offer:</span>{" "}
              {specialOffer || "None"}
            </p>
          </div>

          {/* Specifications */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-3 shadow-inner">
            <h2 className="font-semibold text-lg mb-2 text-gray-800">
              Specifications
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {specifications}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition">
              🛒 Add to Cart
            </button>
            <button className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition">
              ⚡ Buy Now
            </button>
            {role === 'seller' ? (
              <button
              onClick={()=>navigate(`/update-product/${product_id}`)}
              className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl shadow-md hover:bg-gray-700 hover:shadow-lg transform hover:-translate-y-0.5 transition">
                🔁 Update Product
              </button>
            ) : null}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetail;
