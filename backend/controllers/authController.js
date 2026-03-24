const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PasswordReset = require("../models/PasswordReset");
const Portfolio = require("../models/Portfolio");
const Progress = require("../models/Progress");
const User = require("../models/User");
const Watchlist = require("../models/Watchlist");
const {
  sendPasswordResetEmail,
  sendWelcomeEmail,
} = require("../utils/emailService");
const { generatePasswordResetToken } = require("../utils/tokenGenerator");
const { normalizeUpperOrUndefined } = require("../utils/normalize");

const signAuthToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

const buildUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  onboardingComplete: Boolean(user.onboardingComplete),
  riskProfile: user.riskProfile || null,
  literacyScore:
    typeof user.literacyScore === "number" ? user.literacyScore : null,
});

const buildTopAssets = (portfolio) =>
  [...(portfolio?.assets || [])]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)
    .map((asset) => asset.ticker || asset.name);

const register = async (req, res) => {
  const { name, email, password, role, experience, reason } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const allowedRoles = ["learner", "contributor"];
  const userRole = allowedRoles.includes(role) ? role : "learner";

  const user = new User({
    name,
    email,
    password,
    role: userRole,
    status: userRole === "contributor" ? "pending" : "active",
    onboardingComplete: false,
    contributorDetails:
      userRole === "contributor" ? { experience, reason } : undefined,
  });

  await user.save();

  sendWelcomeEmail(user.email, user.name).catch((err) =>
    console.error("Welcome email error:", err)
  );

  if (user.role === "contributor") {
    res.status(201).json({
      message:
        "Registration successful! Please wait for admin approval before logging in.",
      user: buildUserPayload(user),
    });
    return;
  }

  res.status(201).json({
    message: "User registered successfully",
    user: buildUserPayload(user),
  });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

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

  const token = signAuthToken(user);

  res.json({
    token,
    user: buildUserPayload(user),
  });
};

// Get current user profile
const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(buildUserPayload(user));
};

// Get aggregated user context
const getMeContext = async (req, res) => {
  const [user, portfolio, completedProgress, watchlist] = await Promise.all([
    User.findById(req.user.id),
    Portfolio.findOne({ userId: req.user.id }).select("assets totalValue history"),
    Progress.find({ userId: req.user.id, completed: true }).populate({
      path: "lessonId",
      select: "moduleId",
      populate: {
        path: "moduleId",
        select: "courseId",
      },
    }),
    Watchlist.findOne({ userId: req.user.id }).select("items"),
  ]);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const courseIds = new Set(
    completedProgress
      .map((progress) => progress.lessonId?.moduleId?.courseId?.toString())
      .filter(Boolean)
  );

  res.json({
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
      riskProfile: user.riskProfile || null,
      literacyScore:
        typeof user.literacyScore === "number" ? user.literacyScore : null,
      onboardingComplete: Boolean(user.onboardingComplete),
    },
    portfolio: {
      assetCount: portfolio?.assets?.length || 0,
      totalValue: portfolio?.totalValue || 0,
      topAssets: buildTopAssets(portfolio),
    },
    learning: {
      completedLessons: completedProgress.length,
      coursesInProgress: courseIds.size,
    },
    watchlist: {
      count: watchlist?.items?.length || 0,
      symbols: (watchlist?.items || []).map((item) => item.symbol),
    },
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

  res.json(buildUserPayload(updatedUser));
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

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

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

  const { token: rawToken, expiresAt } = generatePasswordResetToken();
  const hashedToken = await bcrypt.hash(rawToken, 12);

  await PasswordReset.deleteMany({ userId: user._id });
  await PasswordReset.create({
    userId: user._id,
    token: hashedToken,
    tokenPrefix: rawToken.substring(0, 8),
    expiresAt,
  });

  try {
    const emailResult = await sendPasswordResetEmail(user.email, rawToken);

    if (emailResult?.degraded) {
      console.warn(
        `Password reset email fallback used for ${user.email}: ${emailResult.message}`
      );
    }

    res.json({
      message: "If that email exists, a password reset link has been sent",
    });
  } catch (error) {
    res.status(500);
    throw new Error(
      process.env.NODE_ENV === "production"
        ? "Password reset is temporarily unavailable"
        : "Failed to send password reset email"
    );
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

  const tokenPrefix = token.substring(0, 8);
  const candidates = await PasswordReset.find({
    tokenPrefix,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  let resetRecord = null;
  for (const candidate of candidates) {
    const isValid = await bcrypt.compare(token, candidate.token);
    if (isValid) {
      resetRecord = candidate;
      break;
    }
  }

  if (!resetRecord) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  const user = await User.findById(resetRecord.userId).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.password = newPassword;
  await user.save();

  resetRecord.used = true;
  await resetRecord.save();

  res.json({ message: "Password reset successfully" });
};

// Complete onboarding
const completeOnboarding = async (req, res) => {
  const { riskProfile, literacyScore, firstAsset } = req.body;

  if (!["beginner", "intermediate", "advanced"].includes(riskProfile)) {
    res.status(400);
    throw new Error("Please choose a valid risk profile");
  }

  if (
    typeof literacyScore !== "number" ||
    Number.isNaN(literacyScore) ||
    literacyScore < 0 ||
    literacyScore > 100
  ) {
    res.status(400);
    throw new Error("Literacy score must be between 0 and 100");
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.riskProfile = riskProfile;
  user.literacyScore = literacyScore;
  user.onboardingComplete = true;
  await user.save();

  if (firstAsset?.name && Number(firstAsset.amount) > 0) {
    let portfolio = await Portfolio.findOne({ userId: req.user.id });

    if (!portfolio) {
      portfolio = new Portfolio({ userId: req.user.id, assets: [] });
    }

    const normalizedTicker = normalizeUpperOrUndefined(firstAsset.ticker) || "";
    const alreadyExists = portfolio.assets.some(
      (asset) => normalizedTicker && asset.ticker === normalizedTicker
    );

    if (!alreadyExists) {
      portfolio.assets.push({
        name: firstAsset.name,
        ticker: normalizedTicker || undefined,
        quoteSymbol: normalizeUpperOrUndefined(firstAsset.quoteSymbol),
        exchange: normalizeUpperOrUndefined(firstAsset.exchange),
        currency: normalizeUpperOrUndefined(firstAsset.currency),
        amount: Number(firstAsset.amount),
        assetType: firstAsset.assetType || "stock",
        purchasePrice:
          firstAsset.purchasePrice !== undefined &&
          firstAsset.purchasePrice !== null &&
          firstAsset.purchasePrice !== ""
            ? Number(firstAsset.purchasePrice)
            : undefined,
      });

      await portfolio.save();
    }
  }

  res.json({
    message: "Onboarding completed successfully",
    user: buildUserPayload(user),
  });
};

module.exports = {
  register,
  login,
  getMe,
  getMeContext,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  completeOnboarding,
};
