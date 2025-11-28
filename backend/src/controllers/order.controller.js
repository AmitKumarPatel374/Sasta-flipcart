const orderModel = require("../model/order.model")
const UserModel = require("../model/user.model")

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id
    const { amountToPay, currencyToPay } = req.body

    const user = await UserModel.findById(userId).populate("cart.productId")

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }
    
    const items = user.cart.map((item) => ({
      product: item.productId._id,
      quantity: item.quantity,
    }))

    // console.log(items);
    // const totalAmount = items.reduce(
    //   (sum, i) => sum + i.productId.price.amount * i.quantity,
    //   0
    // );

    // Create new order
    const order = await orderModel.create({
      userId,
      items,
      price: {
        totalAmount: amountToPay,
        currency: currencyToPay,
      },
      paymentStatus: "Paid",
      orderStatus: "Order Placed",
      tracking: {
        currentLocation: "Warehouse",
        history: [{ location: "Warehouse", status: "Order Placed" }],
      },
    })

    // Clear cart after placing order
    user.cart = []
    await user.save()
    
    return res.status(201).json({
      message:"order created successfully!",
      order:order
    })
  } catch (err) {
    console.log("error in fetchOrder->", error)
    return res.status(500).json({
      message: "internal server error!",
      error: error,
    })
  }
}

const getOrderController = async (req, res) => {
  try {
    const userId = req.user._id

    const orders = await orderModel.find({ userId }).populate("items.productId");

    if (!orders) {
      return res.status(400).json({
        message: "something went wrong",
      })
    }

    return res.status(200).json({
      message: "order gets successfully!",
      orders: orders,
    })
  } catch (error) {
    console.log("error in fetchOrder->", error)
    return res.status(500).json({
      message: "internal server error!",
      error: error,
    })
  }
}
const trackOrderController = async (req, res) => {
  try {
    const orderId = req.params.order_id; 

    const order = await orderModel.findById(orderId).populate("items.productId");

    if (!order) {
      return res.status(400).json({
        message: "something went wrong",
      })
    }

    return res.status(200).json({
      message: "order fetch successfully!",
      order: order,
    })
  } catch (error) {
    console.log("error in trackOrder->", error)
    return res.status(500).json({
      message: "internal server error!",
      error: error,
    })
  }
}

module.exports = { createOrder,getOrderController,trackOrderController }
