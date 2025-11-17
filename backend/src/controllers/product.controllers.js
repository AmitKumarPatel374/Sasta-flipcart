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
    const userId = req.user._id;
    const productId = req.body;

    

    const user = await UserModel.findById(userId);
    console.log(user);
    
    if (!user) return res.status(404).json({ message: "User not found" })

    const item = user.cart.find((p) => p.productId.toString() === productId)

    if (item) {
      item.quantity += 1;
      console.log("quantity badhi");
      
    } else {
      item.cart.push({ productId, quantity: 1 })
    }

    // await user.save()

    // res.status(500).json({
    //   message: "product added in cart",
    //   cart: user.cart,
    // })
  } catch (error) {
    console.log("error in des add to cart->", error)
    return res.status(500).json({
      message: "internal server error!",
    })
  }
}

const fetchProductFromCart = async (req, res) => {
  try {
    const userId = req.userId

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
  fetchProductFromCart
}
