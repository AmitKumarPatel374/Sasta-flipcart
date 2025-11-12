const express = require("express");
const { getAllYourProductsController, getAllUsersController, deleteProductsController, getUserDetailController } = require("../controllers/admin.controllers");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router.get("/get-Your-products/:user_id",adminMiddleware,getAllYourProductsController);
router.get("/get-users",adminMiddleware,getAllUsersController);
router.get("/get-user/:user_id",adminMiddleware,getUserDetailController);
router.delete("/delete-product/:product_id",adminMiddleware,deleteProductsController);

module.exports = router;