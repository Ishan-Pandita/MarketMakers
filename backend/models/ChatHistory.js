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
    maxlength: [10000, "Message cannot exceed 10000 characters"],
  },
  intent: {
    type: String,
    enum: [
      "general_chat",
      "news_simplify",
      "portfolio_guidance",
      "learning_guidance",
    ],
    default: undefined,
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: undefined,
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

const MAX_MESSAGES = 200;
chatHistorySchema.pre("save", function (next) {
  if (this.messages.length > MAX_MESSAGES) {
    this.messages = this.messages.slice(-MAX_MESSAGES);
  }
  next();
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
