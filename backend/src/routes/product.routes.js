const express = require("express");
const { createProductController, getAllProductController, updateProductController, deleteProductController, productDetailController, generateAiDescription, getProductByCategoryController, getProductByItemCategoryController } = require("../controllers/product.controllers");
const uploads = require("../config/database/multer");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router.post("/create-product",adminMiddleware, uploads.array("images", 5), createProductController);

router.get("/get-products",authMiddleware, getAllProductController);
router.get("/product-detail/:product_id", authMiddleware, productDetailController);
router.get("/:category",getProductByCategoryController);
router.get("/:category/:item",getProductByItemCategoryController);


router.put("/update-product/:product_id",authMiddleware, uploads.array("images", 5), updateProductController);
router.delete("/delete-product/:product_id", authMiddleware, deleteProductController);
router.post("/generate-description",authMiddleware, generateAiDescription);

module.exports = router;