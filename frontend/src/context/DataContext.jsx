import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { createContext } from "react"
import apiInstance from "../config/apiInstance"
export const usercontext = createContext(null)

const DataContext = (props) => {
  const [toggle, setToggle] = useState(true)
  const [token, setToken] = useState(false)
  const [role, setRole] = useState(null)
  const [contact, setContact] = useState("")
  const [user_id, setUser_id] = useState(null)
  const [categories, setCategories] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [currency, setCurrency] = useState("")
  const [addressId, setAddressId] = useState(localStorage.getItem("addressId")||null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...")
        const response = await apiInstance.get("/auth/profile")

        if (response && response.data) {
          console.log("✓ Authentication verified - User role:", response.data.user.role)
          setToken(true)
          setRole(response.data.user.role)
          setUser_id(response.data.user._id)
        }
      } catch (error) {
        console.log("✗ Not authenticated or session expired")
        console.log("Error details:", error?.response?.status, error?.response?.data?.message)
        setToken(false)
        setRole(null)
        setUser_id(null)
      }
    }

    const getCategories = async () => {
      try {
        const response = await apiInstance.get("/category/get")
        // console.log(response.data.categories);
        setCategories(response.data.categories)
      } catch (error) {
        console.log(error)
      }
    }
    checkAuth()
    getCategories()
  }, [])

  return (
    <usercontext.Provider
      value={{
        toggle,
        setToggle,
        token,
        setToken,
        role,
        setRole,
        user_id,
        setUser_id,
        contact,
        setContact,
        categories,
        setCategories,
        totalAmount,
        setTotalAmount,
        currency,
        setCurrency,
        addressId,
        setAddressId,
      }}
    >
      {props.children}
    </usercontext.Provider>
  )
}

export default DataContext
