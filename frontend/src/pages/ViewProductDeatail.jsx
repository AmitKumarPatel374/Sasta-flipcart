import { useNavigate, useParams } from "react-router-dom"
import { useContext, useEffect, useState, useRef } from "react"
import apiInstance from "../config/apiInstance"
import { usercontext } from "../context/DataContext"
import { toast } from "react-toastify"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import NavbarFilter from "../components/NavbarFilter"

gsap.registerPlugin(ScrollTrigger)

const ViewProductDetail = () => {
  const { product_id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState("")
  const navigate = useNavigate()
  const { role } = useContext(usercontext)
  const productRef = useRef(null)

  const fetchProductDetail = async () => {
    try {
      console.log(product_id)

      const response = await apiInstance.get(`/product/product-detail/${product_id}`)

      setProduct(response.data.product)
      setMainImage(response.data.product.images?.[0] || "")
      setLoading(false)
    } catch (error) {
      console.error("Error fetching product:", error)
      setLoading(false)
    }
  }

  console.log(product);
  

  const addToCartHandler = async () => {
    const response = await apiInstance.post("/product/addCart",{
      productId: product_id
    });

    toast.success(response.data.message);
  }

  useEffect(() => {
    fetchProductDetail()
  }, [])

  // ✅ GSAP animations
  useEffect(() => {
    if (product) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".product-container",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
        )

        gsap.fromTo(
          ".main-image",
          { opacity: 0, scale: 0.85 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: 0.3,
            ease: "back.out(1.6)",
          }
        )

        gsap.fromTo(
          ".thumbnail",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.6,
            ease: "power2.out",
          }
        )

        gsap.fromTo(
          ".product-info",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            delay: 0.4,
            ease: "power2.out",
          }
        )

        gsap.fromTo(
          ".action-btn",
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: 1.2,
            ease: "back.out(1.5)",
          }
        )
      }, productRef)

      return () => ctx.revert()
    }
  }, [product])

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
    item,
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
    if (res) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: res.data.orders.amount,
        currency: res.data.orders.currency,
        name: "ShopMaster",
        description: "test transaction",
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
          name: "Amit Kumar Patel",
          email: "amit@example.com",
          contact: "9999999999",
        },
        theme: { color: "blue" },
      }

      const razorpayScreen = new window.Razorpay(options)
      razorpayScreen.open()
    }
  }

  return (
    <div>
      <NavbarFilter />

      <div className="flex justify-between text-gray-400 items-center mt-4 ml-2">
        <h3 className=" font-semibold">
          <span
            className="cursor-pointer"
            onClick={() => navigate(`/view-all-product`)}
          >
            {"Product->"}
          </span>
          <span
            className="cursor-pointer"
            onClick={() => navigate(`/${product.category}`)}
          >
            {`${product.category}->`}
          </span>
          <span
            className="cursor-pointer"
            onClick={() => navigate(`/${product.category}/${product.subCategory}/${product.item}`)}
          >
            {`${product.item}->`}
          </span>
          <span className="cursor-pointer">detail</span>
        </h3>
      </div>

      <div
        ref={productRef}
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-100 py-10 px-4 sm:px-6"
      >
        <div className="product-container max-w-6xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10 border border-gray-200">
          {/* 🖼️ Left Section: Product Images */}
          <div className="flex flex-col items-center">
            {/* Main Image */}
            <div className="relative w-full h-72 sm:h-80 md:h-96 bg-gray-50 border rounded-2xl shadow-inner flex justify-center items-center overflow-hidden group">
              <img
                src={mainImage}
                alt={title}
                className="main-image w-[90%] max-h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
              />
              {price && ((price.MRP - price.amount) / price.MRP) * 100 > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg shadow-md">
                  {(((price.MRP - price.amount) / price.MRP) * 100).toFixed(0)}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex mt-4 gap-3 flex-wrap justify-center">
              {images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`thumbnail h-16 w-16 sm:h-20 sm:w-20 object-contain border-2 rounded-lg cursor-pointer p-1 transition-all duration-300 hover:scale-105 ${
                    mainImage === img ? "border-blue-500 shadow-md" : "border-gray-200"
                  }`}
                  alt={`product-${index}`}
                />
              ))}
            </div>
          </div>

          {/* 📄 Right Section: Product Info */}
          <div className="flex flex-col gap-5 justify-between">
            <div className="product-info">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
              <p className="text-gray-500 text-sm">
                Brand: <span className="font-semibold text-gray-700">{brand}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Item: <span className="font-semibold text-gray-700">{item}</span>
              </p>
            </div>

            <p className="product-info text-gray-700 leading-relaxed text-sm sm:text-base border-l-4 border-blue-500 pl-4">
              {description}
            </p>

            {/* 💰 Price Section */}
            <div className="product-info bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-2xl shadow-sm flex flex-col gap-2 items-center md:items-start">
              <div className="text-3xl font-bold text-green-600">₹{price?.amount}</div>
              <div className="text-gray-500 line-through text-sm">₹{price?.MRP}</div>
              <div className="text-blue-600 font-semibold text-sm">
                Save ₹{price?.MRP - price?.amount} (
                {(((price?.MRP - price?.amount) / price?.MRP) * 100).toFixed(0)}% OFF)
              </div>
            </div>

            {/* 📋 Product Details */}
            <div className="product-info grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-gray-700 text-sm">
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
            <div className="product-info bg-gray-50 border border-gray-200 rounded-xl p-4 mt-3 shadow-inner">
              <h2 className="font-semibold text-lg mb-2 text-gray-800">Specifications</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{specifications}</p>
            </div>

            {/* 🛒 Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={addToCartHandler}
                className="action-btn flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={paymentHandler}
                className="action-btn flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition"
              >
                ⚡ Buy Now
              </button>
              {role === "seller" && (
                <button
                  onClick={() => navigate(`/update-product/${product_id}`)}
                  className="action-btn flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl shadow-md hover:bg-gray-700 hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  🔁 Update Product
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProductDetail
