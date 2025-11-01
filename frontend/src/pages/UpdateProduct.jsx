import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiInstance from "../apiInstance";

const UpdateProduct = () => {
  const { product_id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  // const [newImageUxRL, setNewImageURL] = useState("");

  // ✅ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await apiInstance.get(`/product/product-detail/${product_id}`);
        setProduct(data.product);
        setImages(data.product.images || []);
      } catch (error) {
        toast.error("Failed to load product details");
      }
    };
    fetchProduct();
  }, [product_id]);

  // ✅ Handle form field updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("price")) {
      const key = name.split(".")[1];
      setProduct((prev) => ({
        ...prev,
        price: { ...prev.price, [key]: value },
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Handle file uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);
  };

  // ✅ Add image URL
  // const handleAddImageURL = () => {
  //   if (newImageURL.trim() !== "") {
  //     setImages((prev) => [...prev, newImageURL.trim()]);
  //     setNewImageURL("");
  //   }
  // };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("title", product.title);
      formData.append("brand", product.brand);
      formData.append("description", product.description);
      formData.append("color", product.color);
      formData.append("size", product.size);
      formData.append("warrenty", product.warrenty);
      formData.append("specialOffer", product.specialOffer);
      formData.append("specifications", product.specifications);

      formData.append(
        "price",
        JSON.stringify({
          MRP: Number(product.price?.MRP),
          amount: Number(product.price?.amount),
          currency: product.price?.currency || "INR",
        })
      );

      // ✅ Add uploaded files
      newFiles.forEach((file) => formData.append("images", file));

      // ✅ Keep all existing + newly added URLs
      formData.append("existingImages", JSON.stringify(images));

      const response = await apiInstance.put(
        `/product/update-product/${product_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(response.data.message || "Product updated successfully");
      navigate(`/detail/${product_id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // ✅ Delete product
  const handleDeleteProduct = async () => {
    try {
      await apiInstance.delete(`/product/delete-product/${product_id}`);
      toast.success("Product deleted successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg my-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🛍️ Update Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={product.title || ""}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
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
            className="w-full border rounded p-2"
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
            className="w-full border rounded p-2"
            required
          ></textarea>
        </div>

        {/* Price Fields */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-medium mb-1">MRP</label>
            <input
              type="number"
              name="price.MRP"
              value={product.price?.MRP || ""}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
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
              className="w-full border rounded p-2"
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
              className="w-full border rounded p-2"
              required
            />
          </div>
        </div>

        {/* Other fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Color</label>
            <input
              type="text"
              name="color"
              value={product.color || ""}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Size</label>
            <input
              type="text"
              name="size"
              value={product.size || ""}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Warranty</label>
          <input
            type="text"
            name="warrenty"
            value={product.warrenty || ""}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Special Offer</label>
          <input
            type="text"
            name="specialOffer"
            value={product.specialOffer || ""}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Specifications</label>
          <textarea
            name="specifications"
            value={product.specifications || ""}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          ></textarea>
        </div>

        {/* Image Section */}
        <div className="border-t pt-4">
          <label className="block font-semibold mb-2">Product Images</label>

          {/* Show existing images */}
          <div className="flex gap-4 flex-wrap mb-3">
            {images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Product ${index}`}
                className="w-24 h-24 rounded-lg object-cover border"
              />
            ))}
          </div>

          {/* Upload new files */}
          <input type="file" multiple onChange={handleFileChange} className="mb-2" />

          {/* Add image URL */}
          {/* <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add image URL"
              value={newImageURL}
              onChange={(e) => setNewImageURL(e.target.value)}
              className="border rounded p-2 flex-1"
            />
            <button
              type="button"
              onClick={handleAddImageURL}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div> */}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            🔄 Update Product
          </button>

          <button
            type="button"
            onClick={handleDeleteProduct}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            🗑️ Delete Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
