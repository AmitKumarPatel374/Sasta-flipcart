require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
const authRoutes = require("./src/routes/auth.routes");
const productRoutes = require("./src/routes/product.routes");
const connectDB = require("./src/config/database/db");
const cacheInstance = require("./src/services/cache.service");


connectDB();
const app = express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/src/views"));

app.use(express.urlencoded({extended:true}));

cacheInstance.on("connect", () => {
  console.log("Redis connected successfully");
});

cacheInstance.on("error", (error) => {
  console.log("Error connecting redis", error);
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on  port ${port}`);
});