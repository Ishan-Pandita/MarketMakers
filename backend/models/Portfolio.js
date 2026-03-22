const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Asset name is required"],
    trim: true,
    maxlength: [100, "Asset name cannot exceed 100 characters"],
  },
  ticker: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: [10, "Ticker cannot exceed 10 characters"],
  },
  amount: {
    type: Number,
    required: [true, "Investment amount is required"],
    min: [0, "Amount cannot be negative"],
  },
  assetType: {
    type: String,
    enum: ["stock", "crypto", "etf", "bond", "mutual_fund", "commodity", "other"],
    default: "stock",
  },
  purchasePrice: {
    type: Number,
    min: [0, "Purchase price cannot be negative"],
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    assets: [assetSchema],
    totalValue: {
      type: Number,
      default: 0,
    },
    history: [
      {
        date: { type: Date, default: Date.now },
        totalValue: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

// Recalculate total value before saving and cap history
portfolioSchema.pre("save", function (next) {
  this.totalValue = this.assets.reduce((sum, asset) => sum + asset.amount, 0);
  // Keep only the last 365 history entries to prevent unbounded growth
  if (this.history.length > 365) {
    this.history = this.history.slice(-365);
  }
  next();
});

// Index for fast user lookup
portfolioSchema.index({ userId: 1 });

module.exports = mongoose.model("Portfolio", portfolioSchema);
