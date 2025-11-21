import React, { useEffect, useState, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import apiInstance from "../config/apiInstance"
import { toast } from "react-toastify"

gsap.registerPlugin(ScrollTrigger)

const AddressFormLayout = () => {
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    ownerName: "",
    mobile: "",
    pincode: "",
    state: "",
    city: "",
    buildingName: "",
    landmark: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Auto-fill state + city on pincode enter
  const handlePinLookup = async (e) => {
    if (e.length !== 6) return

    try {
      const response = await apiInstance.get(`/address/pin/${e}`)
      const info = response.data

      setFormData({
        ...formData,
        state: info.state,
        city: info.district,
        pincode: e,
      })

      toast.success("Pincode auto-filled successfully!")
    } catch (error) {
      toast.error("Invalid Pincode")
    }
  }

  const submitForm = async (e) => {
    e.preventDefault()

    try {
      const res = await apiInstance.post("/address/add", formData)
      toast.success("Address Added Successfully!")
      console.log(res.data)
    } catch (error) {
      toast.error("Error adding address")
    }
  }

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".form-heading",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      )

      gsap.utils.toArray(".input-box").forEach((box, i) => {
        gsap.fromTo(
          box,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: box,
              start: "top 90%",
            },
          }
        )
      })

      gsap.fromTo(
        ".submit-btn",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".submit-btn",
            start: "top 95%",
          },
        }
      )
    }, formRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 px-6 py-10 flex justify-center items-start">
      <div
        ref={formRef}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl border border-gray-200"
      >
        <h2 className="form-heading text-3xl font-bold text-gray-800 mb-6 text-center">
          Add New Delivery Address
        </h2>

        <form
          onSubmit={submitForm}
          className="space-y-4"
        >
          {/* Owner Name */}
          <div className="input-box">
            <label className="font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              required
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your full name"
            />
          </div>

          {/* Mobile */}
          <div className="input-box">
            <label className="font-semibold text-gray-700">Mobile Number</label>
            <input
              type="number"
              name="mobile"
              maxLength={10}
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="10 Digit Mobile Number"
            />
          </div>

          {/* Pincode */}
          <div className="input-box">
            <label className="font-semibold text-gray-700">Pincode</label>
            <input
              type="number"
              name="pincode"
              value={formData.pincode}
              onChange={(e) => {
                handleChange(e)
                if (e.target.value.length === 6) handlePinLookup(e.target.value)
              }}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Pincode"
            />
          </div>

          {/* State + City Autowired */}
          <div className="flex gap-4">
            <div className="input-box w-1/2">
              <label className="font-semibold text-gray-700">State</label>
              <input
                type="text"
                name="state"
                readOnly
                value={formData.state}
                className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300"
              />
            </div>

            <div className="input-box w-1/2">
              <label className="font-semibold text-gray-700">City / District</label>
              <input
                type="text"
                name="city"
                readOnly
                value={formData.city}
                className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300"
              />
            </div>
          </div>

          {/* Building Name */}
          <div className="input-box">
            <label className="font-semibold text-gray-700">House / Building / Area</label>
            <input
              type="text"
              required
              name="buildingName"
              value={formData.buildingName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Eg: 221B Baker Street"
            />
          </div>

          {/* Landmark */}
          <div className="input-box">
            <label className="font-semibold text-gray-700">Landmark (Optional)</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Near Temple, Mall, etc"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white font-semibold p-3 rounded-lg shadow-lg hover:shadow-indigo-300/50 transition transform hover:-translate-y-1 duration-300"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddressFormLayout
