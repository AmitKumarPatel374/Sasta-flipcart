import React, { useEffect, useState } from "react";
import apiInstance from "../config/apiInstance";
import { useParams } from "react-router-dom";
import { CheckCircle, MapPin, Truck, Home } from "lucide-react";

const TrackOrder = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState(null);

  const trackOrder = async () => {
    try {
      const response = await apiInstance.get(`/order/track/${order_id}`);
      setOrder(response.data.order);
    } catch (error) {
      console.log("error in track->", error);
    }
  };

  useEffect(() => {
    trackOrder();
  }, []);

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-xl">
        Loading tracking details...
      </div>
    );
  }

  const steps = [
    { label: "Order Placed", icon: <CheckCircle /> },
    { label: "Packed", icon: <MapPin /> },
    { label: "Shipped", icon: <Truck /> },
    { label: "Out for Delivery", icon: <Truck /> },
    { label: "Delivered", icon: <Home /> },
  ];

  const currentStatus = order.orderStatus;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">📦 Track Order</h1>

      {/* Order Card */}
      <div className="bg-white p-6 shadow-md rounded-xl mb-6">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-600 text-sm">Order ID</p>
            <p className="text-lg font-semibold">{order._id}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm">Payment</p>
            <p className="text-lg font-semibold text-green-600">{order.paymentStatus}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-600">Total Amount</p>
          <p className="text-xl font-bold">
            ₹ {order.price.totalAmount} {order.price.currency}
          </p>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white p-6 shadow-md rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Tracking Status</h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 left-5 w-1 bg-gray-300 z-1"></div>

          {steps.map((step, index) => {
            const active =
              step.label === order.orderStatus ||
              index < steps.findIndex((s) => s.label === order.orderStatus);

            return (
              <div key={index} className="flex items-start mb-6 z-40">
                {/* Dot */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 z-40 ${
                    active
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-400 border-gray-300"
                  }`}
                >
                  {step.icon}
                </div>

                {/* Labels */}
                <div className="ml-4">
                  <p
                    className={`text-lg font-semibold ${
                      active ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>

                  {/* Show location if matched */}
                  {order.tracking.currentLocation &&
                    order.orderStatus === step.label && (
                      <p className="text-sm text-gray-600">
                        Current Location: {order.tracking.currentLocation}
                      </p>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
