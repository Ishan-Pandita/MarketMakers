const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema(
  {
    lessonid: {
      type: mongoose.Schema.Types.ObjectId, //will store uique id of anoither mongo document
      ref: "Lesson",
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Suggestion", suggestionSchema);
