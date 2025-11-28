const express = require("express");
const { createOrder, getOrderController, trackOrderController } = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create",authMiddleware,createOrder);
router.get("/get",authMiddleware,getOrderController);
router.get("/track/:order_id",authMiddleware,trackOrderController);

module.exports = router;