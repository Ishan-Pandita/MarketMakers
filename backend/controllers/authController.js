const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const {
  sendPasswordResetEmail,
  sendWelcomeEmail,
} = require("../utils/emailService");
const { generatePasswordResetToken } = require("../utils/tokenGenerator");

// Register
const register = async (req, res) => {
  const { name, email, password, role, experience, reason } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // SECURITY: Only allow 'learner' or 'contributor' roles from registration
  // Admin accounts must be created via seed scripts or database directly
  const allowedRoles = ["learner", "contributor"];
  const userRole = allowedRoles.includes(role) ? role : "learner";

  const user = new User({
    name,
    email,
    password, // pre-save hook handles hashing
    role: userRole,
    status: userRole === "contributor" ? "pending" : "active",
    contributorDetails:
      userRole === "contributor"
        ? { experience, reason }
        : undefined,
  });

  await user.save();

  // Send welcome email (non-blocking)
  sendWelcomeEmail(user.email, user.name).catch((err) =>
    console.error("Welcome email error:", err)
  );

  if (user.role === "contributor") {
    res.status(201).json({
      message:
        "Registration successful! Please wait for admin approval before logging in.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } else {
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Check status
  if (user.status === "pending") {
    res.status(403);
    throw new Error("Your account is pending approval by an admin.");
  }

  if (user.status === "rejected") {
    res.status(403);
    throw new Error("Your account application has been rejected.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

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
};

// Get current user profile
const getMe = async (req, res) => {
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
};

// Update profile
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;

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
};

// Change password
const changePassword = async (req, res) => {
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

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  // pre-save hook will hash automatically
  user.password = newPassword;
  await user.save();

  res.json({ message: "Password changed successfully" });
};

// Request password reset
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide an email address");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.json({
      message: "If that email exists, a password reset link has been sent",
    });
    return;
  }

  const { token, expiresAt } = generatePasswordResetToken();

  await PasswordReset.create({
    userId: user._id,
    token,
    expiresAt,
  });

  try {
    await sendPasswordResetEmail(user.email, token);
    res.json({
      message: "If that email exists, a password reset link has been sent",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to send password reset email");
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
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

  const resetRecord = await PasswordReset.findOne({
    token,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!resetRecord) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  const user = await User.findById(resetRecord.userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // pre-save hook will hash automatically
  user.password = newPassword;
  await user.save();

  resetRecord.used = true;
  await resetRecord.save();

  res.json({ message: "Password reset successfully" });
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
