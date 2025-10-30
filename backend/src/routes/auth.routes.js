const express = require("express");
const { registerController, loginController, logoutController, forgotPasswordController, resetPasswordController, updatePasswordController, getProfileController } = require("../controllers/auth.controllers");
const authMiddleware = require("../middlewares/auth.middleware");


const router = express.Router();

router.get("/home", authMiddleware, async (req, res) => {
    return res.send("mai in hu");
})

router.post("/forgot-Password", forgotPasswordController);
router.get("/reset-Password/:token", resetPasswordController);
router.post("/update-Password/:id", updatePasswordController);

router.post("/register", registerController);
router.post("/login", loginController);
router.delete("/logout", logoutController);

router.get('/profile',authMiddleware,getProfileController);

module.exports = router;