const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const { getPaginationData } = require("../utils/pagination");

const ensureLessonModuleAccess = async (moduleId, req) => {
  const moduleDoc = await Module.findById(moduleId);

  if (!moduleDoc) {
    const error = new Error("Module not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    moduleDoc.contributor.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    const error = new Error("Not authorized to manage lessons in this module");
    error.statusCode = 403;
    throw error;
  }

  return moduleDoc;
};

// Add lesson
const createLesson = async (req, res) => {
  try {
    await ensureLessonModuleAccess(req.body.moduleId, req);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw new Error(error.message);
  }

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

  try {
    await ensureLessonModuleAccess(lesson.moduleId, req);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw new Error(error.message);
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

  try {
    await ensureLessonModuleAccess(lesson.moduleId, req);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw new Error(error.message);
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
