const UserModel = require("../model/user.model")
const cacheInstance = require("../services/cache.service")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const sendMail = require("../services/mail.service")
const resePassTemp = require("../utils/email.template")
const sendFilesToStorage = require("../services/storage.service")
const { getCookieOptions, getClearCookieOptions } = require("../utils/cookie.utils")
const otpVerifyTemp = require("../utils/email.verify.temp")
const { sendSMS } = require("../services/message.service")

const registerController = async (req, res) => {
  try {
    let { fullname, email, username, password, mobile, role } = req.body

    if (!fullname || !email || !username || !password || !mobile || !role) {
      return res.status(404).json({
        message: "All fields are required",
      })
    }

    let existingUser = await UserModel.findOne({ email })

    if (existingUser)
      return res.status(422).json({
        message: "User already exists",
      })

    let newUser = await UserModel.create({
      fullname,
      username,
      email,
      mobile,
      password,
      role,
    })

    // let token = newUser.generateToken();
    // res.cookie("token", token, getCookieOptions());

    return res.status(201).json({
      message: "user registered",
      user: newUser,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const loginController = async (req, res) => {
  try {
    let { contact, password } = req.body

    if (!contact || !password) {
      return res.status(404).json({
        message: "All fields are required",
      })
    }

    const isEmail = contact.includes("@")
    const user = isEmail ? await UserModel.findOne({ email:contact }) : await UserModel.findOne({ mobile:contact })

    if (!user)
      return res.status(404).json({
        message: "User not found",
      })

    let cp = await user.comparePass(password)

    if (!cp)
      return res.status(400).json({
        message: "Invalid credentials",
      })

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    user.otp = otp
    user.otpExpiry = otpExpiry
    await user.save()

    let verifyTemp = otpVerifyTemp(user.username, otp)

    if (isEmail) {
      await sendMail(contact, "Verify Your Email", verifyTemp)
    } else {
      await sendSMS(`+91${contact}`, `Your OTP is ${otp}`)
    }

    return res.status(200).json({
      message: `OTP sent to your ${isEmail ? "email" : "mobile"} . Please verify.`,
      user: user,
    })
  } catch (error) {
    console.log("error in login->", error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const verifyEmailByOTPController = async (req, res) => {
  try {
    const { contact, otp } = req.body
    const isEmail = contact.includes("@")
    const user = isEmail
      ? await UserModel.findOne({ email: contact })
      : await UserModel.findOne({ phone: contact })

    if (!user) return res.status(404).json({ message: "user not found" })
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" })
    if (user.otpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" })

    // OTP verified → Clear OTP fields
    user.otp = null
    user.otpExpiry = null
    await user.save()

    let token = user.generateToken()
    console.log("token generated:", token ? "yes" : "no")
    console.log("Environment:", process.env.NODE_ENV || "development")
    console.log(
      "Cookie secure:",
      process.env.NODE_ENV === "production" ? "true (HTTPS)" : "false (HTTP)"
    )
    res.cookie("token", token, getCookieOptions())

    // Debug logging in development
    if (process.env.NODE_ENV !== "production") {
      console.log("Cookie set with options:", getCookieOptions())
    }

    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: user,
    })
  } catch (error) {
    console.log("error in vrification->", error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const logoutController = async (req, res) => {
  try {
    let token = req.cookies.token

    if (!token) {
      return res.status(404).json({
        message: "token not found",
      })
    }

    await cacheInstance.set(token, "blacklisted")

    res.clearCookie("token", getClearCookieOptions())

    return res.status(200).json({
      message: "user logged out successfully!",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const updateUserController = async (req, res) => {
  try {
    let { fullname, email, username, mobile, role } = req.body

    if (!fullname || !email || !username || !mobile || !role) {
      return res.status(404).json({
        message: "All fields are required",
      })
    }

    let uploadedImage = [] //undefined
    if (req.file) {
      uploadedImage = await sendFilesToStorage(req.file.buffer, req.file.originalname)
    }

    let updatedUser = await UserModel.findOneAndUpdate(
      { email },
      {
        fullname,
        email,
        username,
        mobile,
        role,
        profileLogo: uploadedImage.url || "",
      }
    )

    return res.status(201).json({
      message: "user updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const forgotPasswordController = async (req, res) => {
  try {
    let { email } = req.body

    if (!email) {
      return res.status(404).json({
        message: "email not found",
      })
    }

    let user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      })
    }

    let resetToken = jwt.sign({ id: user._id }, process.env.JWT_RAW_SECRET, {
      expiresIn: "5min",
    })

    console.log(resetToken)

    // Use environment variable for reset link base URL
    const baseUrl = process.env.SERVER_ORIGIN
    let resetLink = `${baseUrl}/auth/reset-password/${resetToken}`

    let resetTemp = resePassTemp(user.fullname, resetLink)

    await sendMail(email, "Reset your Password", resetTemp)

    return res.status(201).json({
      message: "reset link sended at your registered email!",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const resetPasswordController = async (req, res) => {
  try {
    let token = req.params.token
    if (!token) {
      return res.status(404).json({
        message: "token not found",
      })
    }

    let decode = jwt.verify(token, process.env.JWT_RAW_SECRET)

    return res.render("index.ejs", { id: decode.id })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const updatePasswordController = async (req, res) => {
  try {
    let id = req.params.id
    let { password } = req.body
    if (!id) {
      return res.status(404).json({
        message: "id not found",
      })
    }

    let hashPass = await bcrypt.hash(password, 11)

    let updatedPassUser = await UserModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        password: hashPass,
      },
      {
        new: true,
      }
    )

    return res.status(200).json({
      message: "password updated successfully!",
      upadatedUser: updatedPassUser,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const getProfileController = async (req, res) => {
  try {
    let user = req.user ///authmiddleware sets this
    return res.status(200).json({
      message: "profile fetched successfully!",
      user: user,
    })
  } catch (error) {
    return res.status(500).json({
      message: "internal server error!",
      error: error,
    })
  }
}

const googleController = async (req, res) => {
  try {
    // console.log("user->",req.user);
    const profile = req.user

    // Example: Create/find user in DB
    let user = await UserModel.findOne({ email: profile.emails[0].value })
    if (!user) {
      user = await UserModel.create({
        fullname: profile.displayName,
        email: profile.emails[0].value,
        username: profile.displayName.split(" ")[0],
        password: "google_auth", // placeholder, not used
        profileLogo: profile.photos[0].value,
      })
    }

    const token = user.generateToken()
    console.log("Google OAuth token generated:", token ? "✓" : "✗")

    res.cookie("token", token, getCookieOptions())

    const redirectUrl = process.env.CLIENT_ORIGIN
    res.redirect(redirectUrl)
  } catch (error) {
    console.log("error in callback url->", error)
    const redirectUrl = process.env.CLIENT_ORIGIN
    res.redirect(redirectUrl)
  }
}

const facebookController = async (req, res) => {
  try {
    // console.log("user->",req.user);
    const profile = req.user

    let email = profile.emails && profile.emails[0]?.value
        ? profile.emails[0].value
        : `${profile.id}@facebook.com`;

    // Example: Create/find user in DB
    let user = await UserModel.findOne({ email })
    if (!user) {
      user = await UserModel.create({
        fullname: profile.displayName,
        email: profile.emails[0].value,
        username: profile.displayName.split(" ")[0],
        password: "facebook_auth", // placeholder, not used
        profileLogo: profile.photos[0].value,
      })
    }

    const token = user.generateToken()
    console.log("facebook OAuth token generated:", token ? "✓" : "✗")

    res.cookie("token", token, getCookieOptions())

    const redirectUrl = process.env.CLIENT_ORIGIN
    res.redirect(redirectUrl)
  } catch (error) {
    console.log("error in callback url->", error)
    const redirectUrl = process.env.CLIENT_ORIGIN
    res.redirect(redirectUrl)
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
  googleController,
  facebookController,
  updateUserController,
  verifyEmailByOTPController,
}
