const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const {
  registerValidator,
  loginValidator,
} = require("../middleware/validators");
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerValidator, asyncHandler(register));
router.post("/login", loginValidator, asyncHandler(login));
router.get("/me", protect, asyncHandler(getMe));
router.put("/profile", protect, asyncHandler(updateProfile));
router.put("/change-password", protect, asyncHandler(changePassword));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/reset-password/:token", asyncHandler(resetPassword));

module.exports = router;
