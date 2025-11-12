const razorpay = require("razorpay");

const razorpayInstance = new razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_API_SECRET
});

module.exports=razorpayInstance;