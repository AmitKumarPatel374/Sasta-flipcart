

const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  sub: [
    {
      title: {
        type: String,
        required: true,
      },

      items: [
        {
          type: String,
          required: true,
        }
      ]
    }
  ]
});

const categoryModel = mongoose.model("category", categorySchema)

module.exports = categoryModel
