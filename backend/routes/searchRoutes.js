const express = require("express");
const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchRegex = new RegExp(q, "i");

    const lessons = await Lesson.find({
      $or: [{ title: searchRegex }, { explanation: searchRegex }],
    })
      .limit(10)
      .populate("moduleID", "title");

    const modules = await Module.find({
      $or: [{ title: searchRegex }, { description: searchRegex }],
    }).limit(5);

    res.json({
      lessons,
      modules,
      total: lessons.length + modules.length,
    });
  })
);

module.exports = router;
