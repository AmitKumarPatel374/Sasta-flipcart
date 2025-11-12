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
        let { title, brand, description, color, price, size, specialOffer, warrenty, specifications } = req.body;

        if (price) {
            try {
                price = JSON.parse(price);
            } catch {
                return res.status(400).json({ message: "Invalid price format" });
            }
        }

        if (!req.files) {
            return res.status(404).json({
                message: "Images is required",
            })
        }

        let uploadedImageUrl = await Promise.all(
            req.files.map(async (elem) => {
                return await sendFilesToStorage(elem.buffer, elem.originalname);
            })
        )


        if (!title || !description || !brand || !color || !specialOffer || !warrenty || !specifications || !price?.MRP ||
            !price?.amount || !price?.currency) {
            return res.status(404).json({
                message: "All fields are required",
            });
        }

        let newProduct = await ProductModel.create({
            title,
            brand,
            description,
            price,
            color,
            size,
            specialOffer,
            warrenty,
            specifications,
            images: uploadedImageUrl.map((elem) => elem.url),
            createdBy:req.user._id
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

        let { title, brand, description, color, size, specialOffer, warrenty, specifications, price } = req.body;

        if (price) {
            try {
                price = JSON.parse(price);
            } catch {
                return res.status(400).json({ message: "Invalid price format" });
            }
        }

        if (!product_id) {
            return res.status(404).json({
                message: "id not found",
            })
        }

        let existingImages = JSON.parse(req.body.existingImages || "[]"); // पुरानी images
        let finalImages = [...existingImages];

        if (req.files && req.files.length > 0) {
            const uploadedImages = await Promise.all(
                req.files.map(async (elem) => {
                    return await sendFilesToStorage(elem.buffer, elem.originalname);
                })
            );
            // merge old + new
            finalImages = [...finalImages, ...uploadedImages.map((img) => img.url)];
        }


        let updatedProduct = await productModel.findByIdAndUpdate(
            {
                _id: product_id,
            },
            {
                title,
                brand,
                description,
                price,
                color,
                size,
                specialOffer,
                warrenty,
                specifications,
                images: finalImages
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
            message: "product deleted successfully!",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "internal server error!",
        })
    }
}

const productDetailController = async (req, res) => {
    try {
        const product_id = req.params.product_id;

        if (!product_id) {
            return res.status(404).json({
                message: "id not found",
            })
        }

        const product = await productModel.findById(product_id);

        if (!product) {
            return res.status(404).json({
                message: "product not found with this id!",
            })
        }

        return res.status(200).json({
            message: "product fetched!",
            product: product
        })
    } catch (error) {
        console.log("error in fetched product->", error);
        return res.status(500).json({
            message: "internal server error!",
        })
    }

}


module.exports = {
    createProductController,
    getAllProductController,
    updateProductController,
    deleteProductController,
    productDetailController
}