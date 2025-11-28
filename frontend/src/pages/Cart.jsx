import { useEffect, useState, useRef, useContext } from "react"
import apiInstance from "../config/apiInstance"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Delete } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { usercontext } from "../context/DataContext"
import { toast } from "react-toastify"

gsap.registerPlugin(ScrollTrigger)

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const pageRef = useRef(null)
  const { totalAmount, setTotalAmount, currency, setCurrency } = useContext(usercontext)
  const navigate = useNavigate()

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
    setCurrency(response.data.cart[0].productId.price.currency)

    localStorage.setItem("amountToPay", total)
    localStorage.setItem("currencyToPay", response.data.cart[0].productId.price.currency)
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
    const res = await apiInstance.delete(`/product/cart/delete/${id}`)
    console.log(res)

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

  const checkOwnersSame = async () => {
    if (cartItems.length === 0) {
      return false
    }

    const owners = cartItems.map((item) => item.productId.createdBy)

    // Check if all owners are same
    const firstOwner = owners[0]
    const allSame = owners.every((owner) => owner === firstOwner)
    return allSame
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
                  onClick={(e) => {
                    e.stopPropagation()
                    updateQuantity(item.productId._id, -1)
                  }}
                  className="bg-gray-200 px-3 py-1 rounded-md text-lg font-bold hover:bg-gray-300"
                >
                  -
                </button>

                <span className="text-xl font-semibold">{item.quantity}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    updateQuantity(item.productId._id, +1)
                  }}
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
              onClick={(e) => {
                e.stopPropagation()
                deleteItem(item.productId._id)
              }}
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
          onClick={() => {
            if(!checkOwnersSame()){
              toast.error("All products must be from the same seller to place the order!");
              return;
            }
            navigate("/product/cart/address")
          }}
          className="bg-green-500 p-2 rounded-xl cursor-pointer hover:bg-green-400"
        >
          Check Out
        </button>
      </div>
    </div>
  )
}

export default Cart
