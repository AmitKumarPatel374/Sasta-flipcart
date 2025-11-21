const express = require("express");
const { pincodeController } = require("../controllers/address.controller");

const router = express.Router();

router.get("/:pin",pincodeController);

module.exports=router;