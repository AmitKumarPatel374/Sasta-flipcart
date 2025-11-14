const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category:{
      type: String,
      required: true,
    },
    subCategory:{
      type: String,
      required: true,
    },
    item:{
      type: String,
      required: true,
    },
    price: {
      MRP: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        enum: ["INR", "DOLLAR"],
        default: "INR",
      },
    },
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    specialOffer: {
      type: String,
    },
    warrenty: {
      type: String,
      required: true,
    },
    specifications: {
      type: String,
      required: true,
    },
    images: {
      type: [],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    razorpay_order_id: {
      type: String,
    },
    payment_status: {
      type: String,
      enum: ["pending", "failed", "success"],
      default:"pending"
    },
  },
  { timestamps: true }
)

const productModel = mongoose.model("product", productSchema)

module.exports = productModel
