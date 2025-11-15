import NavbarFilter from "../components/NavbarFilter"
import ItemPageComponent from "../components/ItemPageComponent"
import apiInstance from "../config/apiInstance"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const FilterByItems = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { category, subCategory, item } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await apiInstance.get(`/product/filter/${category}/${subCategory}/${item}`)
        setItems(response.data.items)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
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
          <span
            className="cursor-pointer"
            onClick={() => navigate(`/${category}`)}
          >
            {`${category}->`}
          </span>
          <span
            className="cursor-pointer"
            onClick={() => navigate(`/${category}/${subCategory}/${item}`)}
          >
            {item}
          </span>
        </h3>
      </div>

      <ItemPageComponent items={items} />
    </div>
  )
}

export default FilterByItems
