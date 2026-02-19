const express = require("express");
const Course = require("../models/Course");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const checkAdmin = require("../middleware/checkAdmin");

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const courses = await Course.find({ isActive: true }).sort({ order: 1 });
        res.json(courses);
    })
);

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error("Course not found");
        }

        res.json(course);
    })
);

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
router.post(
    "/",
    protect,
    async (req, res, next) => {
        // Only admins or authorized contributors can create courses
        // For now, let's keep it simple and check if role is admin or contributor
        if (req.user.role === 'admin' || req.user.role === 'contributor') {
            next();
        } else {
            res.status(401);
            throw new Error("Not authorized as a course creator");
        }
    },
    asyncHandler(async (req, res) => {
        const courseData = {
            ...req.body,
            instructor: req.user.id,
        };

        const course = await Course.create(courseData);
        res.status(201).json(course);
    })
);

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
router.put(
    "/:id",
    protect,
    asyncHandler(async (req, res) => {
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error("Course not found");
        }

        // Check ownership
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error("Not authorized to update this course");
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedCourse);
    })
);

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
router.delete(
    "/:id",
    protect,
    asyncHandler(async (req, res) => {
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error("Course not found");
        }

        // Check ownership
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error("Not authorized to delete this course");
        }

        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: "Course removed" });
    })
);

module.exports = router;
