const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const checkContributor = require("../middleware/checkContributor");
const { lessonValidator } = require("../middleware/validators");
const {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const router = express.Router();

router.post("/", protect, checkContributor, lessonValidator, asyncHandler(createLesson));
router.get("/module/:moduleId", asyncHandler(getLessons));
router.get("/:id", asyncHandler(getLesson));
router.put("/:id", protect, checkContributor, asyncHandler(updateLesson));
router.delete("/:id", protect, checkContributor, asyncHandler(deleteLesson));

module.exports = router;
