import { useNavigate } from "react-router-dom"
import apiInstance from "../config/apiInstance"
import React, { useEffect, useState } from "react"

const GetDeliveryAddress = ({ selectedAddress, setSelectedAddress }) => {
  const [addresses, setAddresses] = useState([])
  const navigate = useNavigate();

  const fetchAddress = async () => {
    try {
      const response = await apiInstance.get("/address/get")
      setAddresses(response.data.addresses || [])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAddress()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Select Delivery Address</h1>

      <div className="space-y-4">
        {addresses.map((item) => (
          <label
            key={item._id}
            className={`block border rounded-xl p-4 cursor-pointer shadow-sm ${
              selectedAddress === item._id ? "border-blue-600 bg-blue-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="address"
                value={item._id}
                checked={selectedAddress === item._id}
                onChange={() => setSelectedAddress(item._id)}
                className="w-5 h-5"
              />

              <div>
                <p className="font-semibold">{item.ownerName}</p>
                <p>{item.buildingName}</p>
                <p>{item.landmark}</p>
                <p>
                  {item.city}, {item.state} - {item.pincode}
                </p>
                <p className="font-medium mt-1">📞 {item.mobile}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Selected Address Output (optional) */}
      {selectedAddress && (
        <div>
          <div className="mt-6 p-4 border rounded-xl bg-green-50 flex justify-between">
            <div >
              <p className="font-semibold">Selected Address ID:</p>
              <p>{selectedAddress}</p>
            </div>
            <div>
              <button onClick={()=>navigate("/product/cart/address/payment")} className="bg-green-500 p-2 rounded-xl cursor-pointer hover:bg-green-400">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GetDeliveryAddress
