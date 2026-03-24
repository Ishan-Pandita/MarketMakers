const mongoose = require("mongoose");

const watchlistItemSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    quoteSymbol: {
      type: String,
      uppercase: true,
      trim: true,
    },
    exchange: {
      type: String,
      uppercase: true,
      trim: true,
    },
    currency: {
      type: String,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    assetType: {
      type: String,
      enum: ["stock", "crypto", "etf", "commodity", "bond", "mutual_fund", "other"],
      default: "stock",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      default: "",
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [watchlistItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Watchlist", watchlistSchema);
