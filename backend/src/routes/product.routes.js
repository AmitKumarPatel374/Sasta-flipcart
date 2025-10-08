const express = require("express");
const { createProductController, getAllProductController, updateProductController, deleteProductController } = require("../controllers/product.controllers");
const uploads = require("../config/database/multer");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create-product",uploads.array("images",5),createProductController);
router.get("/get-products",getAllProductController);
router.put("/update-product/:product_id",uploads.array("images",5),updateProductController);
router.delete("/delete-product/:product_id",authMiddleware ,deleteProductController);

module.exports = router;