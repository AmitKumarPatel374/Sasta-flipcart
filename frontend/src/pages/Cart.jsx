import { useEffect, useState, useRef } from "react"
import apiInstance from "../config/apiInstance"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Delete } from "lucide-react"
import { useNavigate } from "react-router-dom"

gsap.registerPlugin(ScrollTrigger)

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const pageRef = useRef(null)
  const navigate = useNavigate();

  // ----------------------
  // Fetch Cart
  // ----------------------
  const fetchCart = async () => {
    const response = await apiInstance.get("/product/cart")
    setCartItems(response.data.cart)

    let total = 0
    response.data.cart.forEach((item) => {
      total += item.productId.price.amount * item.quantity
    })
    setTotalAmount(total)
  }

  const updateQuantity = async (id, change) => {
    await apiInstance.put("/product/cart/update", {
      productId: id,
      change: change, // +1 or -1
    })
    fetchCart()
  }

  const deleteItem = async (id) => {
    console.log(id)
    await apiInstance.delete(`/product/cart/delete/${id}`)
    fetchCart()
  }

  useEffect(() => {
    fetchCart()

    const ctx = gsap.context(() => {
      gsap.from(".cart-card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      })

      gsap.from(".total-box", {
        opacity: 0,
        y: 20,
        delay: 0.3,
        duration: 1,
        ease: "power3.out",
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const paymentHandler = async () => {
    let details = {
      amount: totalAmount,
      currency: cartItems[0]?.productId?.price?.currency || "INR",
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
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-6"
    >
      <h1 className="text-4xl font-bold mb-10 text-center">
        🛒 <span className="text-blue-600">Your Cart</span>
      </h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* CART ITEMS */}
        {cartItems.map((item) => (
          <div
            onClick={() => navigate(`/detail/${item.productId._id}`)}
            key={item.productId._id}
            className="cart-card flex items-center gap-6 p-5 bg-white rounded-2xl shadow-lg border"
          >
            {/* PRODUCT IMAGE */}
            <img
              src={item.productId.images[0]}
              className="h-24 w-24 object-contain rounded-lg"
            />

            {/* PRODUCT DETAILS */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.productId.title}</h2>
              <p className="text-gray-500">₹{item.productId.price.amount}</p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => updateQuantity(item.productId._id, -1)}
                  className="bg-gray-200 px-3 py-1 rounded-md text-lg font-bold hover:bg-gray-300"
                >
                  -
                </button>

                <span className="text-xl font-semibold">{item.quantity}</span>

                <button
                  onClick={() => updateQuantity(item.productId._id, +1)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-lg font-bold hover:bg-blue-600"
                >
                  +
                </button>
              </div>
            </div>

            {/* PRICE */}
            <div className="text-xl font-bold text-green-600">
              ₹{item.productId.price.amount * item.quantity}
            </div>

            {/* DELETE BUTTON */}
            <button
              onClick={() => deleteItem(item.productId._id)}
              className="text-red-500 font-semibold hover:text-red-700 cursor-pointer"
            >
              <Delete />
            </button>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="total-box max-w-4xl mx-auto mt-10 p-6 bg-white border rounded-2xl shadow-xl flex justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Total Amount: <span className="text-green-600">₹{totalAmount}</span>
        </h2>
        <button
          onClick={paymentHandler}
          className="bg-green-500 p-2 rounded-xl cursor-pointer hover:bg-green-400"
        >
          ⚡ Buy Now
        </button>
      </div>
    </div>
  )
}

export default Cart
