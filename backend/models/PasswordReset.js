const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        token: {
            type: String,
            required: [true, "Reset token is required"],
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: [true, "Expiration date is required"],
        },
        used: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Index for quick token lookup
passwordResetSchema.index({ token: 1 });

// Index to automatically delete expired tokens
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PasswordReset", passwordResetSchema);
