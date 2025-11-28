const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: Number,
    },
  ],

  totalAmount: Number,
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

const orderModel = mongoose.model("order",orderSchema)

module.exports = orderModel;
