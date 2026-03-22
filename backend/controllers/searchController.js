const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const Course = require("../models/Course");

// Global search
const search = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  // Escape special regex characters to prevent ReDoS
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const searchRegex = new RegExp(escaped, "i");

  const [lessons, modules, courses] = await Promise.all([
    Lesson.find({
      $or: [{ title: searchRegex }, { explanation: searchRegex }],
    })
      .limit(10)
      .populate("moduleId", "title"),

    Module.find({
      $or: [{ title: searchRegex }, { description: searchRegex }],
    }).limit(5),

    Course.find({
      $or: [{ title: searchRegex }, { description: searchRegex }],
    }).limit(5),
  ]);

  res.json({
    lessons,
    modules,
    courses,
    total: lessons.length + modules.length + courses.length,
  });
};

module.exports = { search };
