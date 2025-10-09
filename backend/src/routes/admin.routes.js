const express = require("express");
const { getAllProductsController, getAllUsersController, deleteProductsController } = require("../controllers/admin.controllers");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router.get("/get-products",getAllProductsController);
router.get("/get-users",getAllUsersController);
router.delete("/delete-product/:product_id",adminMiddleware,deleteProductsController);

module.exports = router;