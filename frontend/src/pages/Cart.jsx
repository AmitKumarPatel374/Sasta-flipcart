import { useEffect, useState } from "react"
import apiInstance from "../config/apiInstance"

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)

  const fetchCart = async () => {
    const response = await apiInstance.get("/product/cart");
    console.log(response);
    
    setCartItems(response.data.cart)

    // calculate total
    let total = 0
    response.data.cart.forEach(item => {
      total += item.productId.price.amount * item.quantity
    })
    setTotalAmount(total)
  }

  useEffect(() => {
    fetchCart()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.productId._id}
            className="flex items-center gap-4 p-4 border rounded-xl bg-white shadow-sm"
          >
            <img
              src={item.productId.images[0]}
              className="h-20 w-20 object-contain"
            />

            <div className="flex-1">
              <h2 className="font-semibold">{item.productId.title}</h2>
              <p className="text-gray-500">₹{item.productId.price.amount}</p>
              <p>Qty: {item.quantity}</p>
            </div>

            <div className="font-bold text-green-600">
              ₹{item.productId.price.amount * item.quantity}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 border rounded-xl bg-gray-50 shadow-inner">
        <h2 className="text-xl font-bold">Total Amount: ₹{totalAmount}</h2>
      </div>
    </div>
  )
}

export default Cart
