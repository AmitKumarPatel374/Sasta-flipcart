const express = require("express");
const { pincodeController, addAddressController, getAddressController, getAddressByIdController } = require("../controllers/address.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/pin/:pin",authMiddleware,pincodeController);
router.post("/add",authMiddleware,addAddressController);
router.get("/get",authMiddleware,getAddressController);
router.get("/address/:address_id",authMiddleware,getAddressByIdController);

module.exports=router;