import { useParams, useNavigate } from "react-router-dom";
import apiInstance from "../config/apiInstance";
import React, { useEffect, useState } from "react";

const OrderUpdateForm = () => {
  const { order_id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const [formData, setFormData] = useState({
    orderStatus: "",
    currentLocation: "",
    paymentStatus: "",
  });

  // Fetch existing order
  const fetchOrder = async () => {
    try {
      const res = await apiInstance.get(`/order/admin/order/${order_id}`);
      const data = res.data.order;

      setOrder(data);

      // Pre-fill form
      setFormData({
        orderStatus: data.orderStatus,
        currentLocation: data.tracking.currentLocation,
        paymentStatus: data.paymentStatus,
      });

      setLoading(false);
    } catch (error) {
      console.log("error fetching order", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  // UPDATE ORDER
  const updateOrder = async () => {
    try {
      const res = await apiInstance.put(
        `/order/update/${order_id}`,
        formData
      );
      alert("Order updated successfully!");
      navigate("/admin/orders");
    } catch (err) {
      console.log("update error", err);
    }
  };

  if (loading) return <p className="p-10 text-gray-700">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          📝 Update Order
        </h1>

        {/* ORDER SUMMARY */}
        <div className="bg-gray-50 p-4 border rounded-lg mb-6">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>User ID:</strong> {order.userId}</p>
          <p><strong>Seller ID:</strong> {order.seller_id}</p>
          <p><strong>Payment:</strong> {order.paymentStatus}</p>
        </div>

        {/* FORM */}
        <div className="space-y-5">

          {/* ORDER STATUS */}
          <div>
            <label className="font-medium text-gray-700">Order Status</label>
            <select
              value={formData.orderStatus}
              onChange={(e) =>
                setFormData({ ...formData, orderStatus: e.target.value })
              }
              className="w-full p-3 border rounded-lg mt-1"
            >
              <option>Order Placed</option>
              <option>Packed</option>
              <option>Shipped</option>
              <option>Out for Delivery</option>
              <option>Delivered</option>
            </select>
          </div>

          {/* CURRENT LOCATION */}
          <div>
            <label className="font-medium text-gray-700">Current Location</label>
            <input
              type="text"
              value={formData.currentLocation}
              onChange={(e) =>
                setFormData({ ...formData, currentLocation: e.target.value })
              }
              className="w-full p-3 border rounded-lg mt-1"
              placeholder="Update location.."
            />
          </div>

          {/* PAYMENT STATUS */}
          <div>
            <label className="font-medium text-gray-700">Payment Status</label>
            <select
              value={formData.paymentStatus}
              onChange={(e) =>
                setFormData({ ...formData, paymentStatus: e.target.value })
              }
              className="w-full p-3 border rounded-lg mt-1"
            >
              <option>Paid</option>
              <option>Cash on delivery!</option>
            </select>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={updateOrder}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Update Order
          </button>

          <button
            onClick={() => navigate("/admin/orders")}
            className="w-full bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderUpdateForm;
