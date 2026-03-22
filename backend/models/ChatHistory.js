const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: [5000, "Message cannot exceed 5000 characters"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionTitle: {
      type: String,
      default: "New Chat",
      maxlength: [200, "Session title cannot exceed 200 characters"],
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

chatHistorySchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
