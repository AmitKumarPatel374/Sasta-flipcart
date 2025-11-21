const express = require("express");
const { pincodeController, addAddressController, getAddressController } = require("../controllers/address.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/pin/:pin",authMiddleware,pincodeController);
router.post("/add",authMiddleware,addAddressController);
router.post("/get",authMiddleware,getAddressController);

module.exports=router;