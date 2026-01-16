const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "Module ID is required"],
    },
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    explanation: {
      type: String,
      required: [true, "Lesson explanation is required"],
      trim: true,
      minlength: [20, "Explanation must be at least 20 characters"],
    },
    videoLinks: {
      type: [String],
      default: [],
      validate: {
        validator: function (links) {
          return links.every((link) =>
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(link)
          );
        },
        message: "All video links must be valid YouTube URLs",
      },
    },
    order: {
      type: Number,
      required: [true, "Lesson order is required"],
      min: [1, "Order must be at least 1"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
