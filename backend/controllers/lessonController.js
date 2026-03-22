const Lesson = require("../models/Lesson");
const { getPaginationData } = require("../utils/pagination");

// Add lesson
const createLesson = async (req, res) => {
  const lesson = await Lesson.create(req.body);
  res.status(201).json(lesson);
};

// Get lessons by module with pagination
const getLessons = async (req, res) => {
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

  res.json({ lessons, pagination });
};

// Get single lesson
const getLesson = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate(
    "moduleId",
    "title"
  );

  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }

  res.json(lesson);
};

// Update lesson
const updateLesson = async (req, res) => {
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
};

// Delete lesson
const deleteLesson = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }

  await Lesson.findByIdAndDelete(req.params.id);

  res.json({ message: "Lesson deleted successfully" });
};

module.exports = {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
};
