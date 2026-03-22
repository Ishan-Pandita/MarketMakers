const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const { courseValidator } = require("../middleware/validators");
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.get("/", asyncHandler(getAllCourses));
router.get("/:id", asyncHandler(getCourse));
router.post("/", protect, courseValidator, asyncHandler(createCourse));
router.put("/:id", protect, asyncHandler(updateCourse));
router.delete("/:id", protect, asyncHandler(deleteCourse));

module.exports = router;
