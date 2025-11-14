import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import apiInstance from "../config/apiInstance"
import { usercontext } from "../context/DataContext"

const UpdateProduct = () => {
  const { product_id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState({})
  const [images, setImages] = useState([])
  const [newFiles, setNewFiles] = useState([])
  const [newImageURL, setNewImageURL] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSub, setSelectedSub] = useState("")
  const { user_id, categories } = useContext(usercontext)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await apiInstance.get(`/product/product-detail/${product_id}`)
        setProduct(data.product)
        setImages(data.product.images || [])

        // 👉 Set category if product has it
      if (data.product.category) {
        setSelectedCategory(data.product.category)
      }

      // 👉 Set subCategory
      if (data.product.subCategory) {
        setSelectedSub(data.product.subCategory)
      }} catch (error) {
        toast.error("Failed to load product details")
      }
    }
    fetchProduct()
  }, [product_id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes("price")) {
      const key = name.split(".")[1]
      setProduct((prev) => ({
        ...prev,
        price: { ...prev.price, [key]: value },
      }))
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setNewFiles((prev) => [...prev, ...files])
  }

  const handleAddImageURL = () => {
    if (newImageURL.trim() !== "") {
      setImages((prev) => [...prev, newImageURL.trim()])
      setNewImageURL("")
      toast.success("Image added via URL")
    }
  }

  const handleDeleteImage = (url) => {
    setImages((prev) => prev.filter((img) => img !== url))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()

      formData.append("title", product.title)
      formData.append("brand", product.brand)
      formData.append("description", product.description)
      formData.append("category", product.category)
      formData.append("subCategory", product.subCategory)
      formData.append("childCategory", product.childCategory)
      formData.append("color", product.color)
      formData.append("size", product.size)
      formData.append("warrenty", product.warrenty)
      formData.append("specialOffer", product.specialOffer)
      formData.append("specifications", product.specifications)

      formData.append(
        "price",
        JSON.stringify({
          MRP: Number(product.price?.MRP),
          amount: Number(product.price?.amount),
          currency: product.price?.currency || "INR",
        })
      )

      newFiles.forEach((file) => formData.append("images", file))
      formData.append("existingImages", JSON.stringify(images))

      const response = await apiInstance.put(`/product/update-product/${product_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success(response.data.message || "Product updated successfully")
      navigate(`/detail/${product_id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed")
    }
  }

  const handleDeleteProduct = async () => {
    try {
      await apiInstance.delete(`/admin/delete-product/${product_id}`)
      toast.success("Product deleted successfully")
      navigate("/view-all-product")
    } catch (error) {
      toast.error("Failed to delete product")
    }
  }

  // get subcategoriess
  const subCategories = selectedCategory
    ? categories.find((cat) => cat.name === selectedCategory)?.sub || []
    : []

  // get childCategories
  const childCategories = selectedSub
    ? subCategories.find((cat) => cat.title === selectedSub)?.items || []
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4 sm:px-6 lg:px-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          🛍️ Update Product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={product.title || ""}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block font-medium mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={product.brand || ""}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={product.description || ""}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            ></textarea>
          </div>

          {/* category */}
          <select
            name="category"
            value={product.category || selectedCategory}
            className="w-full border px-3 py-2 rounded-md"
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setSelectedSub("") // reset sub
              setProduct({ ...product, category: e.target.value })
            }}
          >
            <option
              value=""
              disabled
              hidden
            >
              Select Category
            </option>
            {categories.map((cat, idx) => (
              <option
                key={idx}
                value={cat.name}
              >
                {cat.name}
              </option>
            ))}
          </select>

          {/* subCategories */}
          <select
            name="subCategory"
            value={product.subCategory || selectedSub}
            className="w-full border px-3 py-2 rounded-md"
            disabled={!selectedCategory}
            onChange={(e) => {
              setSelectedSub(e.target.value)
              setProduct({ ...product, subCategory: e.target.value })
            }}
          >
            <option
              value=""
              disabled
              hidden
            >
              Select Subcategory
            </option>

            {subCategories.map((sub, idx) => (
              <option
                key={idx}
                value={sub.title}
              >
                {sub.title}
              </option>
            ))}
          </select>

          {/* child category */}
          <select
            name="childCategory"
            value={product.childCategory || product.item || ""}
            className="w-full border px-3 py-2 rounded-md"
            disabled={!selectedSub}
            onChange={(e) => setProduct({ ...product, childCategory: e.target.value })}
          >
            <option
              value=""
              disabled
              hidden
            >
              Select Child Category
            </option>

            {childCategories.map((item, idx) => (
              <option
                key={idx}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          {/* Price Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">MRP</label>
              <input
                type="number"
                name="price.MRP"
                value={product.price?.MRP || ""}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Amount</label>
              <input
                type="number"
                name="price.amount"
                value={product.price?.amount || ""}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Currency</label>
              <input
                type="text"
                name="price.currency"
                value={product.price?.currency || "INR"}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
          </div>

          {/* Color & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={product.color || ""}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Size</label>
              <input
                type="text"
                name="size"
                value={product.size || ""}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          {/* Warranty */}
          <div>
            <label className="block font-medium mb-1">Warranty</label>
            <input
              type="text"
              name="warrenty"
              value={product.warrenty || ""}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Special Offer */}
          <div>
            <label className="block font-medium mb-1">Special Offer</label>
            <input
              type="text"
              name="specialOffer"
              value={product.specialOffer || ""}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Specifications */}
          <div>
            <label className="block font-medium mb-1">Specifications</label>
            <textarea
              name="specifications"
              value={product.specifications || ""}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
              rows="3"
            ></textarea>
          </div>

          {/* Images Section */}
          <div className="border-t pt-4">
            <label className="block font-semibold mb-2">Product Images</label>

            {/* Existing Images */}
            <div className="flex flex-wrap gap-3 mb-3 justify-center sm:justify-start">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="relative"
                >
                  <img
                    src={url}
                    alt={`Product ${index}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(url)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1.5 py-0.5 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Upload new files */}
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full mb-3 cursor-pointer rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 px-4 py-2 text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
            />

            {/* Add URL */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Add image URL"
                value={newImageURL}
                onChange={(e) => setNewImageURL(e.target.value)}
                className="border rounded-md p-2 flex-1"
              />
              <button
                type="button"
                onClick={handleAddImageURL}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add URL
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 w-full sm:w-auto"
            >
              🔄 Update Product
            </button>
            <button
              type="button"
              onClick={handleDeleteProduct}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 w-full sm:w-auto"
            >
              🗑️ Delete Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateProduct
