const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const { courseValidator } = require("../middleware/validators");
const Course = require("../models/Course");
const Portfolio = require("../models/Portfolio");
const Progress = require("../models/Progress");
const { getRecommendedCourses } = require("../services/courseRecommender");
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.get("/", asyncHandler(getAllCourses));
router.get(
  "/recommended",
  protect,
  asyncHandler(async (req, res) => {
    const [portfolio, completedProgress] = await Promise.all([
      Portfolio.findOne({ userId: req.user.id }),
      Progress.find({ userId: req.user.id, completed: true }).populate({
        path: "lessonId",
        select: "moduleId",
        populate: {
          path: "moduleId",
          select: "courseId",
        },
      }),
    ]);

    const completedIds = [
      ...new Set(
        completedProgress
          .map((progress) => progress.lessonId?.moduleId?.courseId?.toString())
          .filter(Boolean)
      ),
    ];

    if (!portfolio?.assets?.length) {
      const courses = await Course.find({
        isActive: true,
        tags: { $in: ["beginner"] },
      })
        .limit(3)
        .sort({ order: 1 })
        .select("title description tags thumbnail");

      return res.json({ courses, source: "default" });
    }

    let courses = await getRecommendedCourses(portfolio, completedIds);

    if (courses.length === 0) {
      courses = await Course.find({ isActive: true })
        .limit(3)
        .sort({ order: 1 })
        .select("title description tags thumbnail");

      return res.json({ courses, source: "fallback" });
    }

    return res.json({ courses, source: "portfolio" });
  })
);
router.get("/:id", asyncHandler(getCourse));
router.post("/", protect, courseValidator, asyncHandler(createCourse));
router.put("/:id", protect, asyncHandler(updateCourse));
router.delete("/:id", protect, asyncHandler(deleteCourse));

module.exports = router;
