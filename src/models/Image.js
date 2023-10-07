const mongoose = require("mongoose");

const { Schema } = mongoose;

const ImageSchema = new Schema({
  image_path: {
    type: String,
  },
});

module.exports = mongoose.model("Image", ImageSchema);
