const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const {
  registerValidator,
  loginValidator,
} = require("../middleware/validators");
const {
  sendPasswordResetEmail,
  sendWelcomeEmail,
} = require("../utils/emailService");
const { generatePasswordResetToken } = require("../utils/tokenGenerator");

const router = express.Router();

// Register
router.post(
  "/register",
  registerValidator,
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashPassword,
      role: role || "learner",
    });

    await user.save();

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error("Welcome email error:", err)
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  })
);

// Login
router.post(
  "/login",
  loginValidator,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // IMPORTANT: Include role in token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  })
);

// Get current user profile
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  })
);

// Update profile
router.put(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Only allow updating name and email
    user.name = req.body.name || user.name;

    // Check if email is being changed and if it's already taken
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error("Email already in use");
      }
      user.email = req.body.email;
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  })
);

// Change password
router.put(
  "/change-password",
  protect,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Please provide current and new password");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters");
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  })
);

// Request password reset
router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Please provide an email address");
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      res.json({
        message: "If that email exists, a password reset link has been sent",
      });
      return;
    }

    // Generate reset token
    const { token, expiresAt } = generatePasswordResetToken();

    // Save reset token to database
    await PasswordReset.create({
      userId: user._id,
      token,
      expiresAt,
    });

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, token);
      res.json({
        message: "If that email exists, a password reset link has been sent",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Failed to send password reset email");
    }
  })
);

// Reset password with token
router.post(
  "/reset-password/:token",
  asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      res.status(400);
      throw new Error("Please provide a new password");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      res.status(400);
      throw new Error("Invalid or expired reset token");
    }

    // Update user password
    const user = await User.findById(resetRecord.userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Mark token as used
    resetRecord.used = true;
    await resetRecord.save();

    res.json({ message: "Password reset successfully" });
  })
);

module.exports = router;
