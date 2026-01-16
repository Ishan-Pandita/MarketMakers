const express = require("express");
const Lesson = require("../models/Lesson");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const checkContributor = require("../middleware/checkContributor");
const { getPaginationData } = require("../utils/pagination");

const router = express.Router();

// Add lesson - only contributors
router.post(
  "/",
  protect,
  checkContributor,
  asyncHandler(async (req, res) => {
    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
  })
);

// Get lessons by module with pagination
router.get(
  "/module/:moduleId",
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const totalLessons = await Lesson.countDocuments({
      moduleId: req.params.moduleId,
    });

    const pagination = getPaginationData(page, limit, totalLessons);

    const lessons = await Lesson.find({
      moduleId: req.params.moduleId,
    })
      .sort({ order: 1 })
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage);

    res.json({
      lessons,
      pagination,
    });
  })
);

// Get single lesson
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id).populate(
      "moduleId",
      "title"
    );

    if (!lesson) {
      res.status(404);
      throw new Error("Lesson not found");
    }

    res.json(lesson);
  })
);

// Update lesson - only contributors
router.put(
  "/:id",
  protect,
  checkContributor,
  asyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      res.status(404);
      throw new Error("Lesson not found");
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedLesson);
  })
);

// Delete lesson - only contributors
router.delete(
  "/:id",
  protect,
  checkContributor,
  asyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      res.status(404);
      throw new Error("Lesson not found");
    }

    await Lesson.findByIdAndDelete(req.params.id);

    res.json({ message: "Lesson deleted successfully" });
  })
);

module.exports = router;
