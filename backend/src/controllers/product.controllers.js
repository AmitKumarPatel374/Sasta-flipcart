const productModel = require("../model/product.model");
const ProductModel = require("../model/product.model");


const getAllProductController = async (req, res) => {
    try {
        let allProducts = await productModel.find({});

        if (!allProducts) {
            return res.status(400).json({
                message: "something went wrong",
            })
        }

        if (allProducts.length == 0) {
            return res.status(200).json({
                message: "no product found",
            })
        }

        return res.status(200).json({
            message: "products fetched",
            products: allProducts
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error!",
        })

    }
}


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



module.exports = { createProductController }