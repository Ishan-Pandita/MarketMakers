const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const checkAdmin = require("../middleware/checkAdmin");
const {
  getPendingContributors,
  updateStatus,
  getAdminStats,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", protect, checkAdmin, asyncHandler(getAdminStats));
router.get("/pending-contributors", protect, checkAdmin, asyncHandler(getPendingContributors));
router.put("/update-status/:id", protect, checkAdmin, asyncHandler(updateStatus));

module.exports = router;

