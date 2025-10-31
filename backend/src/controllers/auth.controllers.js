const UserModel = require("../model/user.model");
const cacheInstance = require("../services/cache.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require("../services/mail.service");
const resePassTemp = require("../utils/email.template");

const registerController = async (req, res) => {
    try {
        let { fullname, email,username, password, mobile,role } = req.body;

        if (!fullname || !email || !username || !password || !mobile || !role) {
            return res.status(404).json({
                message: "All fields are required",
            });
        }

        let existingUser = await UserModel.findOne({ email });

        if (existingUser)
            return res.status(422).json({
                message: "User already exists",
            });

        let newUser = await UserModel.create({
            fullname,
            username,
            email,
            mobile,
            password,
            role
        });

        let token = newUser.generateToken();
        res.cookie("token", token);

        return res.status(201).json({
            message: "user registered",
            user: newUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error ",
            error: error,
        });
    }
};

const loginController = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({
                message: "All fields are required",
            });
        }

        let user = await UserModel.findOne({ email });

        if (!user)
            return res.status(404).json({
                message: "User not found",
            });

        let cp = await user.comparePass(password);

        if (!cp)
            return res.status(400).json({
                message: "Invalid credentials",
            });

        let token = user.generateToken();
        res.cookie("token", token);

        return res.status(200).json({
            message: "user logged in",
            token,
            user: user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error ",
            error: error,
        });
    }
};

const logoutController = async (req, res) => {
    try {
        let token = req.cookies.token;

        if (!token) {
            return res.status(404).json({
                message: "token not found",
            });
        }

        await cacheInstance.set(token, "blacklisted");

        res.clearCookie("token");

        return res.status(200).json({
            message: "user logged out successfully!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error ",
            error: error,
        });
    }
}

const forgotPasswordController = async (req, res) => {
    try {
        let { email } = req.body;

        if (!email) {
            return res.status(404).json({
                message: "email not found",
            });
        }

        let user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "user not found",
            });
        }

        let resetToken = jwt.sign({ id: user._id }, process.env.JWT_RAW_SECRET, {
            expiresIn: "2min"
        })

        console.log(resetToken);

        let resetLink = `http://localhost:3000/api/auth/reset-password/${resetToken}`;

        let resetTemp = resePassTemp(user.fullname, resetLink);

        await sendMail(
            email,
            "Reset your Password",
            resetTemp
        );

        return res.status(201).json({
            message: "reset link sended at your registered email!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error ",
            error: error,
        });
    }

}

const resetPasswordController = async (req, res) => {
    try {
        let token = req.params.token;
        if (!token) {
            return res.status(404).json({
                message: "token not found",
            });
        }

        let decode = jwt.verify(token, process.env.JWT_RAW_SECRET);

        return res.render("index.ejs", { id: decode.id })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error ",
            error: error,
        });
    }
}

const updatePasswordController = async (req, res) => {
    try {

        let id = req.params.id;
        let { password } = req.body;
        if (!id) {
            return res.status(404).json({
                message: "id not found",
            });
        }

        let hashPass = await bcrypt.hash(password,11);

        let updatedPassUser = await UserModel.findByIdAndUpdate(
            {
                _id: id
            },
            {
                password: hashPass
            },
            {
                new: true
            }
        )

        return res.status(200).json({
            message: "password updated successfully!",
            upadatedUser: updatedPassUser
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error ",
            error: error,
        });
    }
}

const getProfileController=async(req,res)=>{
    try {
        let user = req.user; ///authmiddleware sets this
        return res.status(200).json({
            message:"profile fetched successfully!",
            user:user
        })
    } catch (error) {
        return res.status(500).json({
            message:"internal server error!",
            error:error
        })
    }
}

const googleController=async(req,res)=>{
    try {
        console.log("user->",req.user);
        res.redirect("/api/auth/profile");
    } catch (error) {
        console.log("error in callback url->",error);
    }
}

module.exports = {
    registerController,
    loginController,
    logoutController,
    forgotPasswordController,
    resetPasswordController,
    updatePasswordController,
    getProfileController,
    googleController
};