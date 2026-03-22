const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const {
  markComplete,
  getProgress,
  getStats,
  checkLesson,
} = require("../controllers/progressController");

const router = express.Router();

router.post("/", protect, asyncHandler(markComplete));
router.get("/me", protect, asyncHandler(getProgress));
router.get("/stats", protect, asyncHandler(getStats));
router.get("/check/:lessonId", protect, asyncHandler(checkLesson));

module.exports = router;
