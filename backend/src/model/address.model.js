const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    minlength: 10,
    maxlength: 10,
    unique:false
  },
  pincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  buildingName: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})



const addressModel = mongoose.model("address",addressSchema);

module.exports=addressModel;
