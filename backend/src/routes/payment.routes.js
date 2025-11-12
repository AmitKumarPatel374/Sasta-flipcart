const express = require("express");
const { paymentVerifyController, paymentProcessController } = require("../controllers/payment.controller");

const router = express.Router();

router.post("/process",paymentProcessController)

router.post("/verify",paymentVerifyController)


module.exports=router;