const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");

// Mark lesson as completed
const markComplete = async (req, res) => {
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
    completed: true,
  });

  res.status(201).json(progress);
};

// Get user progress
const getProgress = async (req, res) => {
  const progress = await Progress.find({
    userId: req.user.id,
  }).populate("lessonId", "title");

  res.json(progress);
};

// Get progress stats
const getStats = async (req, res) => {
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
};

// Check if lesson is completed
const checkLesson = async (req, res) => {
  const progress = await Progress.findOne({
    userId: req.user.id,
    lessonId: req.params.lessonId,
  });

  res.json({ completed: !!progress });
};

module.exports = {
  markComplete,
  getProgress,
  getStats,
  checkLesson,
};
