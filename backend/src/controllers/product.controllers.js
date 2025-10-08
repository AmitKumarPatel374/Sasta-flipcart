const productModel = require("../model/product.model");
const ProductModel = require("../model/product.model");
const sendFilesToStorage = require("../services/storage.service");


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
        
        let uploadedImageUrl = await Promise.all(
            req.files.map(async(elem)=>{
                return await sendFilesToStorage(elem.buffer,elem.originalname);
            })
        )
        

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
            images: uploadedImageUrl.map((elem) => elem.url),
        })

        console.log(newProduct);
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

const updateProductController = async (req, res) => {
    try {
        let product_id = req.params.product_id;

        let { title, description, amount, currency } = req.body;

        if (!product_id) {
            return res.status(404).json({
                message: "id not found",
            })
        }

        let uploadedImage;

        if (req.files) {
            uploadedImage = await Promise.all(
                req.files.map(async (elem) => {
                    return await sendFilesToStorage(elem.buffer, elem.originalname);
                })
            )
        }

        let updatedProduct = await productModel.findByIdAndUpdate(
            {
                _id: product_id,
            },
            {
                title,
                description,
                price: {
                    amount,
                    currency
                },
                images: uploadedImage.map((elem) => elem.url)
            },
            {
                new: true
            }

        )

        return res.status(200).json({
            message: "products updated!",
            product: updatedProduct
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error!",
        })

    }
}

const deleteProductController = async (req, res) => {
    try {
        let product_id = req.params.product_id;

        if (!product_id) {
            return res.status(404).json({
                message: "id not found",
            })
        }

        let deletedProduct = await productModel.findByIdAndDelete(product_id);

        if (!deletedProduct) {
            return res.status(400).json({
                message: "something went wrong",
            })
        }

        return res.status(200).json({
            message: "product deleter successfully!",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "internal server error!",
        })
    }
}


module.exports = {
    createProductController,
    getAllProductController,
    updateProductController,
    deleteProductController
}