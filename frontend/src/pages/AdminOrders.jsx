import React, { useEffect, useState } from "react";
import apiInstance from "../config/apiInstance";
import { MapPin, Truck, CheckCircle, IndianRupee, Clock } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Store each address data
  const [addressList, setAddressList] = useState({});
  // For toggling visibility of each address
  const [openAddress, setOpenAddress] = useState({});

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await apiInstance.get("/order/admin/orders");
      setOrders(response.data.orders);
    } catch (error) {
      console.log("error in fetching orders ->", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Load address by ID
  const loadAddress = async (id) => {
    try {
      const res = await apiInstance.get(`/address/get/${id}`);
      setAddressList((prev) => ({
        ...prev,
        [id]: res.data.address,
      }));
    } catch (error) {
      console.log("Error fetching address", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📦 Seller Orders</h1>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-300 rounded-xl"></div>
          <div className="h-40 bg-gray-300 rounded-xl"></div>
          <div className="h-40 bg-gray-300 rounded-xl"></div>
        </div>
      )}

      {/* IF NO ORDERS */}
      {!loading && orders.length === 0 && (
        <p className="text-center text-gray-600 text-lg">No Orders Found</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Order ID: <span className="text-blue-600">{order._id}</span>
              </h2>

              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  order.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>

            {/* PRODUCT LIST */}
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg border"
                >
                  <img
                    src={item.productId?.image || "/placeholder.jpg"}
                    alt={item.productId?.title}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-lg">
                      {item.productId?.title}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {item.productId?.brand}
                    </p>

                    <p className="text-gray-700 font-medium mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="text-blue-600 font-bold text-lg flex items-center">
                    <IndianRupee size={18} />
                    {item.productId?.price?.amount}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-5" />

            {/* ORDER INFO */}
            <div className="flex flex-col gap-3 text-gray-700 text-sm">

              {/* ADDRESS SECTION */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-blue-600" />
                  <span className="font-medium">
                    Address ID: {order.address_id}
                  </span>

                  {/* BUTTON */}
                  <button
                    onClick={() => {
                      setOpenAddress((prev) => ({
                        ...prev,
                        [order.address_id]: !prev[order.address_id],
                      }));

                      if (!addressList[order.address_id]) {
                        loadAddress(order.address_id);
                      }
                    }}
                    className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    {openAddress[order.address_id] ? "Hide" : "Show"}
                  </button>
                </div>

                {/* ADDRESS BOX */}
                {openAddress[order.address_id] && (
                  <div className="ml-7 mt-2 bg-gray-100 p-3 rounded-lg border text-sm text-gray-700">
                    {addressList[order.address_id] ? (
                      <>
                        <p>
                          <strong>Name:</strong>{" "}
                          {addressList[order.address_id].ownerName}
                        </p>
                        <p>
                          <strong>Mobile:</strong>{" "}
                          {addressList[order.address_id].mobile}
                        </p>
                        <p>
                          <strong>Address:</strong>{" "}
                          {addressList[order.address_id].buildingName},{" "}
                          {addressList[order.address_id].city},{" "}
                          {addressList[order.address_id].state} -{" "}
                          {addressList[order.address_id].pincode}
                        </p>
                        {addressList[order.address_id].landmark && (
                          <p>
                            <strong>Landmark:</strong>{" "}
                            {addressList[order.address_id].landmark}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500 italic">Loading...</p>
                    )}
                  </div>
                )}
              </div>

              <p className="flex items-center gap-2">
                <Clock size={18} className="text-purple-600" />
                <span>
                  Ordered On: {new Date(order.createdAt).toLocaleString()}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" />
                <span>Status: {order.orderStatus}</span>
              </p>

              <p className="flex items-center gap-2">
                <Truck size={18} className="text-orange-600" />
                <span>
                  Current Location: {order.tracking?.currentLocation}
                </span>
              </p>

              <p className="flex items-center gap-2 font-semibold text-lg text-blue-700 mt-3">
                <IndianRupee size={20} />
                Total Amount: {order.price?.totalAmount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
