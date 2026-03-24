const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const Progress = require("../models/Progress");
const Suggestion = require("../models/Suggestion");
const { getPaginationData } = require("../utils/pagination");

// Create module
const createModule = async (req, res) => {
  const { title, description, order, courseId } = req.body;

  if (!courseId) {
    res.status(400);
    throw new Error("Course ID is required");
  }

  const course = await Course.findById(courseId);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  if (
    course.instructor.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to create modules in this course");
  }

  const moduleData = {
    title,
    description,
    order,
    courseId,
    contributor: req.user.id,
  };

  const mod = await Module.create(moduleData);
  res.status(201).json(mod);
};

// Get all modules with pagination
const getModules = async (req, res) => {
  const { page = 1, limit = 10, contributor, courseId } = req.query;

  let query = {};
  if (contributor) query.contributor = contributor;
  if (courseId) query.courseId = courseId;

  const totalModules = await Module.countDocuments(query);
  const pagination = getPaginationData(page, limit, totalModules);

  const modules = await Module.find(query)
    .sort({ order: 1 })
    .skip(pagination.skip)
    .limit(pagination.itemsPerPage);

  res.json({ modules, pagination });
};

// Get single module
const getModule = async (req, res) => {
  const mod = await Module.findById(req.params.id);

  if (!mod) {
    res.status(404);
    throw new Error("Module not found");
  }

  res.json(mod);
};

// Update module
const updateModule = async (req, res) => {
  const mod = await Module.findById(req.params.id);

  if (!mod) {
    res.status(404);
    throw new Error("Module not found");
  }

  if (mod.contributor.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this module");
  }

  const updatedModule = await Module.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedModule);
};

// Delete module (with cascade)
const deleteModule = async (req, res) => {
  const mod = await Module.findById(req.params.id);

  if (!mod) {
    res.status(404);
    throw new Error("Module not found");
  }

  if (mod.contributor.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this module");
  }

  // Cascade delete: lessons → progress & suggestions
  const lessons = await Lesson.find({ moduleId: req.params.id });
  const lessonIds = lessons.map((l) => l._id);

  if (lessonIds.length > 0) {
    await Progress.deleteMany({ lessonId: { $in: lessonIds } });
    await Suggestion.deleteMany({ lessonId: { $in: lessonIds } });
    await Lesson.deleteMany({ moduleId: req.params.id });
  }

  await Module.findByIdAndDelete(req.params.id);

  res.json({ message: "Module and all related content deleted successfully" });
};

module.exports = {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
};
