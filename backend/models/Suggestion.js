const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "Lesson ID is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    text: {
      type: String,
      required: [true, "Suggestion text is required"],
      trim: true,
      minlength: [10, "Suggestion must be at least 10 characters"],
      maxlength: [1000, "Suggestion cannot exceed 1000 characters"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Suggestion", suggestionSchema);
