const express = require("express")
const {
  createOrder,
  getOrderController,
  trackOrderController,
  adminOrdersController,
  getOrderByIdController,
  updateOrderController,
} = require("../controllers/order.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

router.post("/create", authMiddleware, createOrder)
router.get("/get", authMiddleware, getOrderController)
router.get("/track/:order_id", authMiddleware, trackOrderController)
router.get("/admin/orders", authMiddleware, adminOrdersController)
router.get("/admin/order/:order_id", authMiddleware,getOrderByIdController)
router.put("/admin/order/update/:order_id", authMiddleware,updateOrderController)

module.exports = router
