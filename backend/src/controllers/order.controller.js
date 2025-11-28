const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserModel.findById(userId).populate("cart.productId");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = user.cart.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity
    }));

    const totalAmount = items.reduce(
      (sum, i) => sum + i.productId.price.amount * i.quantity,
      0
    );

    // Create new order
    const order = await OrderModel.create({
      userId,
      items,
      totalAmount,
      paymentStatus: "Paid",
      orderStatus: "Order Placed",
      tracking: {
        currentLocation: "Warehouse",
        history: [
          { location: "Warehouse", status: "Order Placed" }
        ]
      }
    });

    // Clear cart after placing order
    user.cart = [];
    await user.save();

    res.json({ message: "Order created", order });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {createOrder}
