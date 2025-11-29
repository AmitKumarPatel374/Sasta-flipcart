const razorpayInstance = require("../services/payment.service");
const productModel = require("../model/product.model");
 const crypto = require("crypto");

const paymentProcessController =async(req,res)=>{
    try {
        const {amount,currency}=req.body;
        
        
        if (!amount || !currency) {
          return res.status(404).json({
            message:"amount or currency are not found!"
          })
        }
        
        const options={
          amount:amount*100,
          currency:currency||"INR",
          receipt:`receipt_${Date.now()}`,
          payment_capture:1
        }
        
        const orders = await razorpayInstance.orders.create(options);
        console.log("order created->",orders);

        if (!orders) {
            return res.status(404).json({
                message:"order not generated!"
            })
        }

        return res.status(200).json({
            message:"order generated successfully!",
            orders
        })
        
    } catch (error) {
        console.log("error in payment process->",error);
        return res.status(500).json({
            message:"internal server error!",
            error:error
        })
    }
}

const paymentVerifyController = async(req,res)=>{
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment details" });
    }

    // verify signature
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    return res.status(200).json({
      message: "Payment verified successfully",
      payment: {
        status: "paid",
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
      }
    });

  } catch (error) {
    console.log("verify error ->", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports ={
    paymentProcessController,
    paymentVerifyController
}