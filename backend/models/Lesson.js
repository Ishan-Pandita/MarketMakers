const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  moduleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
  }, //this will help us to store lesson with module id so that it will come under it
  title: {
    type: String,
    required: true,
  },
  explanation: String,
  videoLinks: [String], //array of Youtube tutorials
  order: Number,
});

module.exports = mongoose.model("Lesson", lessonSchema);
