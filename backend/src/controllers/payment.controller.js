const razorpayInstance = require("../services/payment.service");
const productModel = require("../model/product.model");

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
        let {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      product_id,
    } = req.body;

    console.log(razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      product_id);
    

     if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !product_id
    )
      return res.status(404).json({
        message: "Order not found",
      });

    let product = await productModel.findById(product_id);

    if (!product)
      return res.status(404).json({
        message: "Product not found for this order",
      });

    product.payment_status="success",
    product.save();

    return res.status(200).json({
        message:"payment successfull"
    })

    } catch (error) {
         console.log("this way verify error->", error);
    return res.status(500).json({
      message: "Internal server error",
    });
    }
}

module.exports ={
    paymentProcessController,
    paymentVerifyController
}