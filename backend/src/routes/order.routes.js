const express = require("express");
const { createOrder, getOrderController } = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create",authMiddleware,createOrder);
router.get("/get",authMiddleware,getOrderController);

module.exports = router;