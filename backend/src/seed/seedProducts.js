require("dotenv").config();
const mongoose = require("mongoose");
const productModel = require("../model/product.model");

const products = [
  {
    title: "Redmi 12A",
    brand: "Redmi",
    category: "Mobiles",
    color: "Black",
    price: { amount: 7999 },
    specifications: { ram: "4GB", storage: "64GB", battery: "5000mAh" },
    stock: 25,
    images: [],
    description: "Budget smartphone with long battery life"
  },
  {
    title: "Noise Buds Wireless",
    brand: "Noise",
    category: "Accessories",
    color: "Black",
    price: { amount: 1199 },
    specifications: { type: "Earbuds", connectivity: "Bluetooth" },
    stock: 100,
    images: [],
    description: "True wireless earbuds with decent sound"
  },
  {
    title: "Nike Running Shoes",
    brand: "Nike",
    category: "Shoes",
    color: "Blue",
    price: { amount: 2999 },
    specifications: { sizeRange: "7-11", material: "Mesh" },
    stock: 50,
    images: [],
    description: "Comfortable shoes for running"
  }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await productModel.deleteMany({});
    await productModel.insertMany(products);
    console.log("Seeded products.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
