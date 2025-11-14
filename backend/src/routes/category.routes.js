const express = require("express");
const {addCategoryController,getCategoryController} = require("../controllers/category.controller");


const router = express.Router();

router.post("/add",addCategoryController);
router.get("/get",getCategoryController);


module.exports=router;