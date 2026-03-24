const express = require("express");
const rateLimit = require("express-rate-limit");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const {
  registerValidator,
  loginValidator,
  onboardingValidator,
} = require("../middleware/validators");
const {
  register,
  login,
  getMe,
  getMeContext,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  completeOnboarding,
} = require("../controllers/authController");

const router = express.Router();

const sensitiveAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts, please try again later" },
});

router.post("/register", sensitiveAuthLimiter, registerValidator, asyncHandler(register));
router.post("/login", sensitiveAuthLimiter, loginValidator, asyncHandler(login));
router.get("/me", protect, asyncHandler(getMe));
router.get("/me/context", protect, asyncHandler(getMeContext));
router.put("/profile", protect, asyncHandler(updateProfile));
router.put("/change-password", protect, sensitiveAuthLimiter, asyncHandler(changePassword));
router.post(
  "/complete-onboarding",
  protect,
  onboardingValidator,
  asyncHandler(completeOnboarding)
);
router.post("/forgot-password", sensitiveAuthLimiter, asyncHandler(forgotPassword));
router.post("/reset-password/:token", sensitiveAuthLimiter, asyncHandler(resetPassword));

module.exports = router;
