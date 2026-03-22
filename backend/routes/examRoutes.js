const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const { examValidator } = require("../middleware/validators");
const {
  getExams,
  getExam,
  submitAttempt,
  getUserAttempts,
  getAttempt,
  getCertificate,
  createExam,
} = require("../controllers/examController");

const router = express.Router();

router.get("/", asyncHandler(getExams));
router.get("/attempts/me", protect, asyncHandler(getUserAttempts));
router.get("/attempt/:id", protect, asyncHandler(getAttempt));
router.get("/attempt/:id/certificate", protect, asyncHandler(getCertificate));
router.get("/:id", asyncHandler(getExam));
router.post("/:id/attempt", protect, asyncHandler(submitAttempt));
router.post("/", protect, examValidator, asyncHandler(createExam));

module.exports = router;
