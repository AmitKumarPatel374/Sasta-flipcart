const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: Number,
    },
  ],
  price: {
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["INR", "DOLLAR"],
      default: "INR",
    },
  },
  paymentStatus: {
    type: String,
    default: "Paid",
  },

  orderStatus: {
    type: String,
    enum: ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"],
    default: "Order Placed",
  },

  tracking: {
    currentLocation: { type: String, default: "Warehouse" },
    history: [
      {
        location: String,
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const orderModel = mongoose.model("order", orderSchema)

module.exports = orderModel
