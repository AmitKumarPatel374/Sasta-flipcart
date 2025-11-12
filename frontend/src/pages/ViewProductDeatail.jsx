import { useNavigate, useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import apiInstance from '../config/apiInstance';
import { usercontext } from "../context/DataContext"
import { toast } from "react-toastify";

const ViewProductDetail = () => {
  const { product_id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState("")
  const navigate = useNavigate()
  const { role } = useContext(usercontext)

  const fetchProductDetail = async () => {
    try {
      const response = await apiInstance.get(`/product/product-detail/${product_id}`)
      setProduct(response.data.product)
      setMainImage(response.data.product.images?.[0] || "")
      setLoading(false)
    } catch (error) {
      console.error("Error fetching product:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetail()
  }, [])

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-blue-500 animate-pulse">
        Loading product details...
      </div>
    )

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Product not found.
      </div>
    )

  const {
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
  } = product

  const paymentHandler = async () => {
    let details = {
      amount: price.amount,
      currency: price.currency,
    }

    const res = await apiInstance.post("/payment/process", details)
    console.log(res)

    if (res) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: res.data.orders.amount,
        currency: res.data.orders.currency,
        name: "ShopMaster",
        description: "test trancation",
        image: "",
        order_id: res.data.orders.id,
        handler: async function (response) {
          const verifyRes = await apiInstance.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            product_id: product._id,
          })
          toast.success(verifyRes.data.message)
        },
        prefill: {
          name: "Devendra Dhote",
          email: "devendra@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "blue",
        },
      }

       const razorpayScreen = new window.Razorpay(options);
      razorpayScreen.open();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 p-5 sm:p-10">
        {/* 🖼️ Left Section: Product Images */}
        <div className="flex flex-col items-center">
          {/* Main Image */}
          <div className="relative w-full h-72 sm:h-80 md:h-96 bg-gray-50 border rounded-2xl shadow-inner flex justify-center items-center overflow-hidden group">
            <img
              src={mainImage}
              alt={title}
              className="w-[90%] max-h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
            />
            {price && ((price.MRP - price.amount) / price.MRP) * 100 > 0 && (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg shadow-md">
                {(((price.MRP - price.amount) / price.MRP) * 100).toFixed(0)}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="flex mt-4 gap-3 flex-wrap justify-center sm:justify-start overflow-x-auto max-w-full">
            {images?.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setMainImage(img)}
                className={`h-16 w-16 sm:h-20 sm:w-20 object-contain border-2 rounded-lg cursor-pointer p-1 transition-all duration-300 hover:scale-105 ${
                  mainImage === img ? "border-blue-500 shadow-md" : "border-gray-200"
                }`}
                alt={`product-${index}`}
              />
            ))}
          </div>
        </div>

        {/* 📄 Right Section: Product Info */}
        <div className="flex flex-col gap-5 justify-between">
          {/* Title and Brand */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2 text-center md:text-left">
              {title}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base text-center md:text-left">
              Brand: <span className="font-semibold text-gray-700">{brand}</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base border-l-4 border-blue-500 pl-3 sm:pl-4">
            {description}
          </p>

          {/* 💰 Price Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col gap-2 items-center md:items-start">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">₹{price?.amount}</div>
            <div className="text-gray-500 line-through text-xs sm:text-sm">₹{price?.MRP}</div>
            <div className="text-blue-600 font-semibold text-xs sm:text-sm">
              Save ₹{price?.MRP - price?.amount} (
              {(((price?.MRP - price?.amount) / price?.MRP) * 100).toFixed(0)}% OFF)
            </div>
            <p className="text-xs text-gray-500">Currency: {price?.currency}</p>
          </div>

          {/* 📋 Product Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-gray-700 text-sm sm:text-base">
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
              <span className="font-semibold">Special Offer:</span> {specialOffer || "None"}
            </p>
          </div>

          {/* ⚙️ Specifications */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 mt-3 shadow-inner">
            <h2 className="font-semibold text-lg mb-2 text-gray-800">Specifications</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{specifications}</p>
          </div>

          {/* 🛒 Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <button className="flex-1 cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition text-sm sm:text-base">
              🛒 Add to Cart
            </button>
            <button
              onClick={paymentHandler}
              className="flex-1 cursor-pointer px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition text-sm sm:text-base"
            >
              ⚡ Buy Now
            </button>
            {role === "seller" && (
              <button
                onClick={() => navigate(`/update-product/${product_id}`)}
                className="flex-1 cursor-pointer px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl shadow-md hover:bg-gray-700 hover:shadow-lg transform hover:-translate-y-0.5 transition text-sm sm:text-base"
              >
                🔁 Update Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProductDetail
