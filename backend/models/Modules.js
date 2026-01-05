const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  order: Number, //to cotrol learning sequence
});

module.exports = mongoose.model("Module", moduleSchema);
