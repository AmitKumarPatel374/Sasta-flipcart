import apiInstance from "../config/apiInstance"
import React from "react"

const OrderPage = () => {
  const fetchOrder = async () => {
    try {
      const response = await apiInstance.get("/order/get")
      console.log(response)
    } catch (error) {
      console.log("error in fetchorder->", error)
    }
  }
  return (
    <div>
      <button onClick={fetchOrder} className="border p-5">click</button>
    </div>
  )
}

export default OrderPage
