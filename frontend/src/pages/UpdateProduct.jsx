import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiInstance from "../config/apiInstance";
import { usercontext } from "../context/DataContext";

const UpdateProduct = () => {
  const { product_id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newImageURL, setNewImageURL] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const { categories } = useContext(usercontext);

  // -------- FETCH PRODUCT --------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await apiInstance.get(
          `/product/product-detail/${product_id}`
        );

        const p = data.product;

        setProduct({
          ...p,
          childCategory: p.item || "", // IMPORTANT FIX
        });

        setImages(p.images || []);

        if (p.category) setSelectedCategory(p.category);
        if (p.subCategory) setSelectedSub(p.subCategory);
      } catch (error) {
        toast.error("Failed to load product details");
      }
    };

    fetchProduct();
  }, [product_id]);

  // -------- INPUT CHANGE HANDLER --------
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

  // -------- IMAGE FILE UPLOAD --------
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);
  };

  // -------- ADD IMAGE BY URL --------
  const handleAddImageURL = () => {
    if (!newImageURL.trim()) return;

    setImages((prev) => [...prev, newImageURL.trim()]);
    setNewImageURL("");
    toast.success("Image added via URL");
  };

  // -------- DELETE EXISTING IMAGE --------
  const handleDeleteImage = (url) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  // -------- SUBMIT FORM --------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", product.title);
      formData.append("brand", product.brand);
      formData.append("description", product.description);
      formData.append("category", selectedCategory);
      formData.append("subCategory", selectedSub);
      formData.append("childCategory", product.childCategory); // FIXED
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

      // Add new files
      newFiles.forEach((file) => formData.append("images", file));

      // Add existing images
      formData.append("existingImages", JSON.stringify(images));

      const response = await apiInstance.put(
        `/product/update-product/${product_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(response.data.message || "Product updated successfully");
      navigate(`/detail/${product_id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // -------- DELETE PRODUCT --------
  const handleDeleteProduct = async () => {
    try {
      await apiInstance.delete(`/admin/delete-product/${product_id}`);
      toast.success("Product deleted successfully");
      navigate("/view-all-product");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // -------- CATEGORY HANDLING --------
  const subCategories = selectedCategory
    ? categories.find((cat) => cat.name === selectedCategory)?.sub || []
    : [];

  const childCategories = selectedSub
    ? subCategories.find((s) => s.title === selectedSub)?.items || []
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4 sm:px-6 lg:px-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          🛍️ Update Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={product.title || ""}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          {/* BRAND */}
          <div>
            <label className="block font-medium mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={product.brand || ""}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={product.description || ""}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
              rows="3"
              required
            ></textarea>
          </div>

          {/* CATEGORY */}
          <select
            value={selectedCategory}
            className="w-full border px-3 py-2 rounded-md"
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSub("");
              setProduct({ ...product, childCategory: "" });
            }}
          >
            <option value="" disabled hidden>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* SUB CATEGORY */}
          <select
            value={selectedSub}
            disabled={!selectedCategory}
            className="w-full border px-3 py-2 rounded-md"
            onChange={(e) => {
              setSelectedSub(e.target.value);
              setProduct({ ...product, childCategory: "" });
            }}
          >
            <option value="" disabled hidden>
              Select Subcategory
            </option>
            {subCategories.map((sub) => (
              <option key={sub.title} value={sub.title}>
                {sub.title}
              </option>
            ))}
          </select>

          {/* CHILD CATEGORY // FIXED */}
          <select
            name="childCategory"
            value={product.childCategory || ""}
            disabled={!selectedSub}
            onChange={(e) =>
              setProduct({ ...product, childCategory: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="" disabled hidden>
              Select Child Category
            </option>

            {childCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* PRICE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">MRP</label>
              <input
                type="number"
                name="price.MRP"
                value={product.price?.MRP || ""}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
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
              />
            </div>
          </div>

          {/* COLOR & SIZE */}
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

          {/* WARRANTY */}
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

          {/* SPECIAL OFFER */}
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

          {/* SPECIFICATIONS */}
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

          {/* IMAGES */}
          <div className="border-t pt-4">
            <label className="block font-semibold mb-2">Product Images</label>

            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt=""
                    className="w-24 h-24 rounded-lg object-cover border"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 py-0.5 text-xs"
                    onClick={() => handleDeleteImage(url)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full mb-3 border-2 border-dashed p-2 rounded-md"
            />

            <div className="flex gap-2">
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
                className="bg-blue-600 px-4 py-2 text-white rounded-md"
              >
                Add URL
              </button>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md w-full sm:w-auto"
            >
              🔄 Update Product
            </button>

            <button
              type="button"
              onClick={handleDeleteProduct}
              className="bg-red-600 text-white px-6 py-2 rounded-md w-full sm:w-auto"
            >
              🗑️ Delete Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
