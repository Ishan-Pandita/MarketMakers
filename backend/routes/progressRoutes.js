const express = require("express");
const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");
const protect = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

// Mark lesson as completed
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { lessonId } = req.body;

    if (!lessonId) {
      res.status(400);
      throw new Error("Lesson ID is required");
    }

    const exists = await Progress.findOne({
      userId: req.user.id,
      lessonId,
    });

    if (exists) {
      return res.json({
        message: "Lesson already completed",
        progress: exists,
      });
    }

    const progress = await Progress.create({
      userId: req.user.id,
      lessonId,
      completed: true, // Explicitly set to true
    });

    res.status(201).json(progress);
  })
);

// Get user progress
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const progress = await Progress.find({
      userId: req.user.id,
    }).populate("lessonId", "title");

    res.json(progress);
  })
);

// Get progress stats - NEW
router.get(
  "/stats",
  protect,
  asyncHandler(async (req, res) => {
    const completed = await Progress.countDocuments({
      userId: req.user.id,
      completed: true,
    });

    const total = await Lesson.countDocuments();
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      completedLessons: completed,
      totalLessons: total,
      completionPercentage: percentage,
    });
  })
);

// Check if lesson is completed - NEW
router.get(
  "/check/:lessonId",
  protect,
  asyncHandler(async (req, res) => {
    const progress = await Progress.findOne({
      userId: req.user.id,
      lessonId: req.params.lessonId,
    });

    res.json({ completed: !!progress });
  })
);

module.exports = router;
