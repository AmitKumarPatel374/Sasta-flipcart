const {mongoose } = require("mongoose")
const productModel = require("../model/product.model")
const ProductModel = require("../model/product.model")
const UserModel = require("../model/user.model")
const groq = require("../services/groqAI.service")
const sendFilesToStorage = require("../services/storage.service")

const getAllProductController = async (req, res) => {
  try {
    let allProducts = await productModel.find({})

    if (!allProducts) {
      return res.status(400).json({
        message: "something went wrong",
      })
    }

    if (allProducts.length == 0) {
      return res.status(200).json({
        message: "no product found",
      })
    }

    return res.status(200).json({
      message: "products fetched",
      products: allProducts,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error!",
    })
  }
}

const getProductByCategoryController = async (req, res) => {
  try {
    const cat = req.params.category
    let products = await productModel.find({ category: cat })

    if (!products) {
      return res.status(400).json({
        message: "something went wrong",
      })
    }

    if (products.length == 0) {
      return res.status(200).json({
        message: "no product found",
      })
    }

    return res.status(200).json({
      message: "products fetched",
      products: products,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error!",
    })
  }
}

const getProductByItemCategoryController = async (req, res) => {
  try {
    const item = req.params.item
    let products = await productModel.find({ item: item })

    if (!products) {
      return res.status(400).json({
        message: "something went wrong",
      })
    }

    if (products.length == 0) {
      return res.status(200).json({
        message: "no product found",
      })
    }

    return res.status(200).json({
      message: "products fetched",
      items: products,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error!",
    })
  }
}

const searchProductController = async (req, res) => {
  try {
    const { q } = req.query

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query required" })
    }

    const query = q.trim()
    const tokens = query.split(/\s+/) // multiple words → multi-token search

    let andConditions = []

    tokens.forEach((word) => {
      const escaped = escapeRegex(word)
      const regex = new RegExp(escaped, "i")

      // if the token is a number → consider it price too
      const isNumber = !isNaN(word)

      let orConditions = [
        { title: regex },
        { brand: regex },
        { description: regex },
        { category: regex },
        { subCategory: regex },
        { item: regex },
        { specifications: regex },
        { color: regex },
        { size: regex },
        { "price.currency": regex },
      ]

      if (isNumber) {
        orConditions.push({ "price.amount": Number(word) }, { "price.MRP": Number(word) })
      }

      andConditions.push({ $or: orConditions })
    })

    const products = await productModel.find({ $and: andConditions })

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    })
  } catch (error) {
    console.log("Search API Error:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

const createProductController = async (req, res) => {
  try {
    let {
      title,
      brand,
      description,
      category,
      subCategory,
      childCategory,
      color,
      price,
      size,
      specialOffer,
      warrenty,
      specifications,
    } = req.body

    if (price) {
      try {
        price = JSON.parse(price)
      } catch {
        return res.status(400).json({ message: "Invalid price format" })
      }
    }

    if (!req.files) {
      return res.status(404).json({
        message: "Images is required",
      })
    }

    let uploadedImageUrl = await Promise.all(
      req.files.map(async (elem) => {
        return await sendFilesToStorage(elem.buffer, elem.originalname)
      })
    )

    if (
      !title ||
      !description ||
      !brand ||
      !category ||
      !subCategory ||
      !childCategory ||
      !color ||
      !specialOffer ||
      !warrenty ||
      !specifications ||
      !price?.MRP ||
      !price?.amount ||
      !price?.currency
    ) {
      return res.status(404).json({
        message: "All fields are required",
      })
    }

    let newProduct = await ProductModel.create({
      title,
      brand,
      description,
      category,
      subCategory,
      item: childCategory,
      price,
      color,
      size,
      specialOffer,
      warrenty,
      specifications,
      images: uploadedImageUrl.map((elem) => elem.url),
      createdBy: req.user._id,
    })

    console.log(newProduct)
    return res.status(200).json({
      message: "product created",
      product: newProduct,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    })
  }
}

const updateProductController = async (req, res) => {
  try {
    let product_id = req.params.product_id

    let {
      title,
      brand,
      description,
      category,
      subCategory,
      childCategory,
      color,
      size,
      specialOffer,
      warrenty,
      specifications,
      price,
    } = req.body

    if (price) {
      try {
        price = JSON.parse(price)
      } catch {
        return res.status(400).json({ message: "Invalid price format" })
      }
    }

    if (!product_id) {
      return res.status(404).json({
        message: "id not found",
      })
    }

    let existingImages = JSON.parse(req.body.existingImages || "[]") // पुरानी images
    let finalImages = [...existingImages]

    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(async (elem) => {
          return await sendFilesToStorage(elem.buffer, elem.originalname)
        })
      )
      // merge old + new
      finalImages = [...finalImages, ...uploadedImages.map((img) => img.url)]
    }

    let updatedProduct = await productModel.findByIdAndUpdate(
      {
        _id: product_id,
      },
      {
        title,
        brand,
        description,
        category,
        subCategory,
        item: childCategory,
        price,
        color,
        size,
        specialOffer,
        warrenty,
        specifications,
        images: finalImages,
      },
      {
        new: true,
      }
    )

    return res.status(200).json({
      message: "products updated!",
      product: updatedProduct,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error!",
    })
  }
}

const deleteProductController = async (req, res) => {
  try {
    let product_id = req.params.product_id

    if (!product_id) {
      return res.status(404).json({
        message: "id not found",
      })
    }

    let deletedProduct = await productModel.findByIdAndDelete(product_id)

    if (!deletedProduct) {
      return res.status(400).json({
        message: "something went wrong",
      })
    }

    return res.status(200).json({
      message: "product deleted successfully!",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "internal server error!",
    })
  }
}

const productDetailController = async (req, res) => {
  try {
    const product_id = req.params.product_id

    if (!product_id) {
      return res.status(404).json({
        message: "id not found",
      })
    }

    const product = await productModel.findById(product_id)
    console.log(product)

    if (!product) {
      return res.status(404).json({
        message: "product not found with this id!",
      })
    }

    return res.status(200).json({
      message: "product fetched!",
      product: product,
    })
  } catch (error) {
    console.log("error in fetched product->", error)
    return res.status(500).json({
      message: "internal server error!",
    })
  }
}

const generateAiDescription = async (req, res) => {
  try {
    const { title, brand, specifications, color } = req.body

    const prompt = `Generate a professional SEO-friendly product description.
                     Title:${title}
                     Brand:${brand}
                     Color:${color}
                     Specifications:${specifications}

                     Give output in 2 parts:
                    1. Short Description (2–3 lines)
                    2. Detailed Description (5–8 lines)
                     `

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    })

    const text = response.choices[0].message.content
    const shortDesc = text.split("**Part 2")[0].replace("**Part 1: Short Description**", "").trim()
    const detailDesc = text.split(" **Part 2: Detailed Description**")[1]

    return res.status(200).json({
      success: true,
      short: shortDesc,
      detail: detailDesc,
    })
  } catch (error) {
    console.log("error in des generation->", error)
    return res.status(500).json({
      message: "internal server error!",
    })
  }
}

const addCartHandler = async (req, res) => {
  try {
    const userId = req.user._id
    const { productId } = req.body

    const user = await UserModel.findById(userId)
    // console.log(user)

    if (!user) return res.status(404).json({ message: "User not found" })

    // Ensure cart exists
    user.cart = user.cart || []

    // Check item exists in cart
    let item = user.cart.find((p) => p.productId.toString() === productId)

    if (item) {
      item.quantity += 1
    } else {
      user.cart.push({ productId, quantity: 1 })
    }

    await user.save()

    res.status(200).json({
      message: "product added in cart",
      cart: user.cart,
    })
  } catch (error) {
    console.log("error in des add to cart->", error)
    return res.status(500).json({
      message: "internal server error!",
    })
  }
}

const fetchProductFromCart = async (req, res) => {
  try {
    const userId = req.user._id

    const user = await UserModel.findById(userId).populate("cart.productId")

    res.status(200).json({
      cart: user.cart,
    })
  } catch (error) {
    console.log("error in fetching products from cart->", error)
    return res.status(500).json({
      message: "internal server error!",
    })
  }
}

const updateCartQuantity = async (req, res) => {
  try {
    const { productId, change } = req.body
    const userId = req.user._id

    const user = await UserModel.findById(userId)
    // console.log(user)

    if (!user) return res.status(404).json({ message: "User not found" })

    // Check item exists in cart
    let item = user.cart.find((p) => p.productId.toString() === productId)

    if (!item) return res.status(404).json({ message: "Item not found" })

    item.quantity += change
    if (item.quantity < 1) item.quantity = 1

    await user.save()

    res.json({ message: "Quantity updated", cart: user.cart })
  } catch (err) {
    console.log("error in change quantity->", err)
    res.status(500).json({ message: "Server Error", err })
  }
}

const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id

    await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          cart: { productId: new mongoose.Types.ObjectId(productId) },
        },
      },
      { new: true }
    )

    res.json({ message: "Item removed from cart" })
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error", err })
  }
}

const shopMasterChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "message required" });

    // 1) Use AI to extract filters + intent (JSON output)
    const extractionPrompt = `
Extract shopping intent and return JSON only (no extra text).

User message: "${message}"

Return JSON with fields:
{
  "category": "Mobiles / Shoes / Makeup / Laptop / Clothing / null",
  "maxPrice": number or null,
  "minPrice": number or null,
  "color": string or null,
  "brand": string or null,
  "type": "product-query" | "login-help" | "general-query" | "other"
}

If user asks "how to login" or "forgot password" -> type = "login-help".
If user asks about orders, returns, delivery, payment -> type = "general-query".
If it's clearly product search or recommendation -> type = "product-query".
If uncertain -> type = "other".
    `;

    const extractionResp = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: extractionPrompt }]
    });

    // parse JSON safely
    let filters = {};
    try {
      const raw = extractionResp.choices[0].message.content.trim();
      filters = JSON.parse(raw);
    } catch (e) {
      // fallback if parsing fails
      filters = { category: null, maxPrice: null, minPrice: null, color: null, brand: null, type: "other" };
    }

    // 2) If product-query -> query MongoDB
    let products = [];
    if (filters.type === "product-query") {
      const query = {};
      if (filters.category) query.category = { $regex: new RegExp(filters.category, "i") };
      if (filters.brand) query.brand = { $regex: new RegExp(filters.brand, "i") };
      if (filters.color) query.color = { $regex: new RegExp(filters.color, "i") };

      if (filters.minPrice || filters.maxPrice) {
        query["price.amount"] = {};
        if (filters.minPrice) query["price.amount"].$gte = Number(filters.minPrice);
        if (filters.maxPrice) query["price.amount"].$lte = Number(filters.maxPrice);
      }

      products = await ProductModel.find(query).limit(15).lean();
    }

    // 3) Compose final prompt for the AI to answer the user
    const finalPrompt = `
You are ShopMaster AI Assistant.

User question:
"${message}"

Extracted Filters:
${JSON.stringify(filters, null, 2)}

Product Results (from DB):
${JSON.stringify(products, null, 2)}

Rules:
- If type = "login-help": give step-by-step instructions for login/signup/password reset for ShopMaster.
- If type = "general-query": answer concisely about delivery, return policy, payments, tracking.
- If type = "product-query": recommend from 'Product Results' only. If empty, say "No products found matching your filters on ShopMaster."
- If type = "other": ask a clarifying question or handle politely.
- Use plain, friendly language and keep replies short (max 6 sentences).
    `;

    const finalResp = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: finalPrompt }]
    });

    const reply = finalResp.choices[0].message.content;
    return res.json({ success: true, reply, products });

  } catch (err) {
    console.error("AI Chatbot Error:", err);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};


module.exports = {
  createProductController,
  getAllProductController,
  updateProductController,
  deleteProductController,
  productDetailController,
  generateAiDescription,
  getProductByCategoryController,
  getProductByItemCategoryController,
  searchProductController,
  addCartHandler,
  fetchProductFromCart,
  updateCartQuantity,
  deleteCartItem,
  shopMasterChat
}
