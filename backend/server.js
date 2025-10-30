require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
const authRoutes = require("./src/routes/auth.routes");
const productRoutes = require("./src/routes/product.routes");
const adminRoutes = require("./src/routes/admin.routes");
const connectDB = require("./src/config/database/db");
const cacheInstance = require("./src/services/cache.service");


connectDB();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", // 👈 your frontend URL
    credentials: true,               // 👈 allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
app.use("/api/admin", adminRoutes);

let port = process.env.PORT ||5000;

app.listen(port, () => {
  console.log(`Server is running on  port ${port}`);
});