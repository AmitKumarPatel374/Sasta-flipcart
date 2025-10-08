const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
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
        images: {
            type: [],
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;