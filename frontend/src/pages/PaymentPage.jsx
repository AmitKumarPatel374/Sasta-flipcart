import React, { useContext, useState } from "react";
import apiInstance from "../config/apiInstance";
import { toast } from "react-toastify";
import { usercontext } from "../context/DataContext";

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const {totalAmount,currency}=useContext(usercontext);
  

  console.log(selectedMethod);
  

  const handleCOD = () => {
    toast.success("order placed successfully!")
  };


   const paymentHandler = async () => {
    let details = {
      amount: totalAmount || localStorage.getItem("amountToPay"),
      currency: currency||localStorage.getItem("currencyToPay")||"INR",
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
    <div className=" bg-gray-100 flex justify-center p-4 md:p-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Payment Options
        </h1>

        {/* OPTION: CASH ON DELIVERY */}
        <div
          className={`p-5 rounded-xl border mb-5 cursor-pointer transition-colors 
          ${selectedMethod === "COD" ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
          onClick={() => setSelectedMethod("COD")}
        >
          <div className="flex gap-4 items-start">
            <input
              type="radio"
              checked={selectedMethod === "COD"}
              onChange={() => setSelectedMethod("COD")}
              name="payment"
              className="mt-1 h-5 w-5"
            />
            <div>
              <p className="font-semibold text-lg text-gray-800">Cash on Delivery</p>
              <p className="text-gray-600 text-sm">
                Pay with cash when your order is delivered.
              </p>
            </div>
          </div>
        </div>

        {/* OPTION: ONLINE PAYMENT */}
        <div
          className={`p-5 rounded-xl border mb-6 cursor-pointer transition-colors 
          ${selectedMethod === "ONLINE" ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
          onClick={() => setSelectedMethod("ONLINE")}
        >
          <div className="flex gap-4 items-start">
            <input
              type="radio"
              checked={selectedMethod === "ONLINE"}
              onChange={() => setSelectedMethod("ONLINE")}
              name="payment"
              className="mt-1 h-5 w-5"
            />
            <div>
              <p className="font-semibold text-lg text-gray-800">Online Payment</p>
              <p className="text-gray-600 text-sm">
                Pay using UPI, Cards, Netbanking or Wallets.
              </p>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={paymentHandler}
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-blue-700 transition"
        >
          Pay Now
        </button>

      </div>
    </div>
  );
};

export default PaymentPage;
