const axios = require("axios")
const addressModel = require("../model/address.model")

const pincodeController = async (req, res) => {
  try {
    const { pin } = req.params
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pin}`)

    const data = response.data[0]

    if (data.Status !== "Success") {
      return res.status(400).json({ message: "Invalid PIN code" })
    }

    return res.status(200).json({
      message: "Pincode verified",
      state: data.PostOffice[0].State,
      district: data.PostOffice[0].District,
      area: data.PostOffice[0].Name,
    })
  } catch (error) {
    console.log("error in pin validation->", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    })
  }
}

const addAddressController = async (req, res) => {
  try {
    const { ownerName, mobile, pincode, state, city, buildingName, landmark } = req.body

    if (!ownerName || !mobile || !pincode || !state || !city || !buildingName) {
      return req.status(404).json({
        message: "all feilds are required",
      })
    }

    let add = await addressModel.create({
      ownerName,
      mobile,
      pincode,
      state,
      city,
      buildingName,
      landmark,
      userId: req.user._id,
    })

    if (!add) {
      return res.status(400).json({
        message: "something went wrong!",
      })
    }

    return res.status(201).json({
      message: "address added successfully!",
      address:add
    })
  } catch (error) {
    console.log("error in adding address->", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    })
  }
}

module.exports = { pincodeController,addAddressController }
