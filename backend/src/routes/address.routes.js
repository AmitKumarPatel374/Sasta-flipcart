const express = require("express");
const { pincodeController, addAddressController } = require("../controllers/address.controller");

const router = express.Router();

router.get("/pin/:pin",pincodeController);
router.post("/add",addAddressController);

module.exports=router;