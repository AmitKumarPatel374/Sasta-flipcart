const productModel = require("../model/product.model");
const UserModel = require("../model/user.model")


const getAllUsersController = async (req, res) => {

    try {
        let allUsers = await UserModel.find({});

        if (!allUsers) {
            return res.status(400).json({
                message: "something went wrong"
            })
        }

        if (allUsers.length == 0 || allUsers == null) {
            return res.status(200).json({
                message: "No users have!"
            })
        }

        return res.status(200).json({
            message: "all users fetched!",
            users: allUsers
        })
    } catch (error) {
        console.log("error->", error);
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
}

const getAllProductsController = async (req, res) => {

    try {
        let allProducts = await productModel.find({});

        if (!allProducts) {
            return res.status(400).json({
                message: "something went wrong"
            })
        }

        if (allProducts.length == 0 || allProducts == null) {
            return res.status(200).json({
                message: "No products have!"
            })
        }

        return res.status(200).json({
            message: "all Products fetched!",
            users: allProducts
        })
    } catch (error) {
        console.log("error->", error);
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
}

const deleteProductsController = async (req, res) => {
    try {
        let product_id = req.params.product_id;
        if (!product_id) {
            return res.status(404).json({
                message: "product_id not found"
            })
        }

        await productModel.findByIdAndDelete(product_id);

        return res.status(200).json({
            message: "product deleted successfully!",
        })
    } catch (error) {
        console.log("error->", error);
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
}

module.exports ={
    getAllUsersController,
    getAllProductsController,
    deleteProductsController
}

