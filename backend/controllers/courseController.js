const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const Progress = require("../models/Progress");
const Suggestion = require("../models/Suggestion");

// Get all courses
const getAllCourses = async (req, res) => {
  const { instructor } = req.query;
  let query = { isActive: true };

  if (instructor) {
    query.instructor = instructor;
  }

  const courses = await Course.find(query).sort({ order: 1 });
  res.json(courses);
};

// Get single course
const getCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.json(course);
};

// Create a course
const createCourse = async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "contributor") {
    res.status(403);
    throw new Error("Not authorized as a course creator");
  }

  const courseData = {
    ...req.body,
    instructor: req.user.id,
  };

  const course = await Course.create(courseData);
  res.status(201).json(course);
};

// Update a course
const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  if (
    course.instructor.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to update this course");
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedCourse);
};

// Delete a course (with cascade)
const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  if (
    course.instructor.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this course");
  }

  // Cascade delete: modules → lessons → progress & suggestions
  const modules = await Module.find({ courseId: req.params.id });
  const moduleIds = modules.map((m) => m._id);

  if (moduleIds.length > 0) {
    const lessons = await Lesson.find({ moduleId: { $in: moduleIds } });
    const lessonIds = lessons.map((l) => l._id);

    if (lessonIds.length > 0) {
      await Progress.deleteMany({ lessonId: { $in: lessonIds } });
      await Suggestion.deleteMany({ lessonId: { $in: lessonIds } });
      await Lesson.deleteMany({ moduleId: { $in: moduleIds } });
    }

    await Module.deleteMany({ courseId: req.params.id });
  }

  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course and all related content removed" });
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
