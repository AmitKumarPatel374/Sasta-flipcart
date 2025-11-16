import ItemPageComponent from "../components/ItemPageComponent"
import NavbarFilter from "../components/NavbarFilter"
import apiInstance from "../config/apiInstance"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const SearchItem = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  const {searchValue}=useParams();

  useEffect(() => {
    const searchProducts = async () => {
      try {
        const response = await apiInstance.get(`/product/search?q=${searchValue}`)
        setItems(response.data.products)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [])

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg font-medium animate-pulse">Loading products...</p>
      </div>
    )

  if (error)
    return (
      <div>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500 text-lg font-medium">{error}</p>
        </div>
      </div>
    )

  return (
    <div>
      <NavbarFilter />
      <div className="flex justify-between text-gray-400 items-center mt-5 ml-5">
        <h3 className=" font-semibold">
          <span
            className="cursor-pointer"
            onClick={() => navigate(`/view-all-product`)}
          >
            {"Product->"}
          </span>
          <span>{"search"}</span>
        </h3>
      </div>

      <ItemPageComponent items={items} />
    </div>
  )
}

export default SearchItem
