import React, { useEffect, useState } from "react";
import apiInstance from "../config/apiInstance";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  // --------------------------
  // Fetch Orders
  // --------------------------
  const fetchOrder = async () => {
    try {
      const response = await apiInstance.get("/order/get");
      setOrders(response.data.orders || []);
    } catch (error) {
      console.log("error in fetchorder->", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📦 My Orders</h1>

      {/* If no orders */}
      {orders.length === 0 && (
        <div className="text-center text-lg font-medium text-gray-600">
          No orders found 😕
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span className="font-semibold text-green-600">
                  {order.tracking?.status}
                </span>
              </p>
            </div>

            {/* Product Items */}
            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex items-center gap-4 p-3 border rounded-lg"
                >
                  <img
                    src={item.productId.images[0]}
                    alt=""
                    className="w-40 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-md font-semibold">
                      {item.productId.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>

                    <p className="text-sm text-gray-700 font-medium">
                      ₹ {item.productId.price.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="mt-4 flex justify-between items-center border-t pt-3">
              <div>
                <p className="text-gray-600 text-sm">Payment</p>
                <p className="text-lg font-bold">
                  ₹ {order.price.totalAmount}
                </p>
              </div>

              <button  className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                Track Order →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
