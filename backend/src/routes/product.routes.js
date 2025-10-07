const express = require("express");
const { createProductController } = require("../controllers/product.controllers");
const uploads = require("../config/database/multer");

const router = express.Router();

router.post("/create-product",uploads.array("images",5),createProductController);

module.exports = router;