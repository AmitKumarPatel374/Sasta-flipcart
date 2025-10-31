const express = require("express");
const passport = require("passport");
const { registerController, loginController, logoutController, forgotPasswordController, resetPasswordController, updatePasswordController, getProfileController, googleController } = require("../controllers/auth.controllers");
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


router.get("/google",passport.authenticate("google",{scope:["profile","email"]}));

router.get("/google/callback",passport.authenticate("google",{failureRedirect:"/api/auth/google/failed"}),googleController);

//failed api
router.get("/google/failed",(req,res)=>{
    res.send("tumse n ho payega");
})

//success api
router.get("/profile",(req,res)=>{
    res.send(`ho gya aa gaye login hokar ${req.user.displayName}`);
})

module.exports = router;