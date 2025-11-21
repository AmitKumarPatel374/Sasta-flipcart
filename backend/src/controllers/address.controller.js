const axios = require("axios");

const pincodeController = async (req, res) => {
  try {
    const { pin } = req.params;
    console.log(pin);

    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pin}`
    );

    const data = response.data[0];

    if (data.Status !== "Success") {
      return res.status(400).json({ message: "Invalid PIN code" });
    }

    return res.status(200).json({
      message: "Pincode verified",
      state: data.PostOffice[0].State,
      district: data.PostOffice[0].District,
      area: data.PostOffice[0].Name,
    });

  } catch (error) {
    console.log("error in pin validation->", error);
    return res.status(500).json({
      message: "Internal server error",
      error
    });
  }
};

module.exports = { pincodeController };
