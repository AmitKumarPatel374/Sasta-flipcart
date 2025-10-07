const ProductModel = require("../model/product.model");



const createProductController = async (req, res) => {
    try {
        let { title, description, amount, currency } = req.body;

        if (!req.files) {
            return res.status(404).json({
                message: "Images is required",
            })
        }

        if (!title || !description || !amount || !currency) {
            return res.status(404).json({
                message: "All fields are required",
            });
        }

        let newProduct = await ProductModel.create({
            title,
            description,
            price: {
                amount,
                currency
            },
            images: req.files.map((elem) => elem.url),
        })

        return res.status(200).json({
            message: "product created",
            product: newProduct
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error,
        });
    }
}

module.exports = {createProductController}