const categoryModel = require("../model/category.model")

const addCategoryController =async(req,res)=>{
      try {
    const { name, sub } = req.body;

    if (!name || !sub) {
      return res.status(400).json({ message: "Name and Subcategories required!" });
    }

    const newCategory = new categoryModel({ name, sub });
    await newCategory.save();

    return res.status(201).json({
      message: "Category added successfully",
      category: newCategory,
    });

  } catch (error) {
    console.log("Error adding category:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const getCategoryController =async(req,res)=>{
    try {


    const categories= await categoryModel.find();

    return res.status(201).json({
      message: "Category fetched successfully",
      categories: categories,
    });

  } catch (error) {
    console.log("Error adding category:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
    addCategoryController,
    getCategoryController
}
