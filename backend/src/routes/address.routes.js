const express = require("express");
const { pincodeController, addAddressController } = require("../controllers/address.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/pin/:pin",pincodeController);
router.post("/add",authMiddleware,addAddressController);

module.exports=router;