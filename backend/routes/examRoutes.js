const express = require("express");
const Exam = require("../models/Exam");
const ExamAttempt = require("../models/ExamAttempt");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all active exams
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const exams = await Exam.find({ isActive: true }).select(
            "-questions.correctAnswer"
        ); // Hide correct answers

        res.json(exams);
    })
);

// Get single exam (without correct answers)
router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const exam = await Exam.findById(req.params.id).select(
            "-questions.correctAnswer"
        );

        if (!exam) {
            res.status(404);
            throw new Error("Exam not found");
        }

        if (!exam.isActive) {
            res.status(403);
            throw new Error("This exam is not currently available");
        }

        res.json(exam);
    })
);

// Submit exam attempt
router.post(
    "/:id/attempt",
    protect,
    asyncHandler(async (req, res) => {
        const { answers } = req.body; // Array of { questionIndex, selectedAnswer }

        if (!answers || !Array.isArray(answers)) {
            res.status(400);
            throw new Error("Please provide answers array");
        }

        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            res.status(404);
            throw new Error("Exam not found");
        }

        if (!exam.isActive) {
            res.status(403);
            throw new Error("This exam is not currently available");
        }

        // Calculate score
        let correctAnswers = 0;
        const totalQuestions = exam.questions.length;

        answers.forEach((answer) => {
            const question = exam.questions[answer.questionIndex];
            if (question && question.correctAnswer === answer.selectedAnswer) {
                correctAnswers++;
            }
        });

        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const passed = score >= exam.passingScore;

        // Save attempt
        const attempt = await ExamAttempt.create({
            userId: req.user.id,
            examId: exam._id,
            answers,
            score,
            passed,
        });

        // If passed and it's a contributor exam, upgrade user role
        if (passed && exam.title.toLowerCase().includes("contributor")) {
            await User.findByIdAndUpdate(req.user.id, { role: "contributor" });
        }

        res.status(201).json({
            attemptId: attempt._id,
            score,
            passed,
            passingScore: exam.passingScore,
            correctAnswers,
            totalQuestions,
            message: passed
                ? "Congratulations! You passed the exam!"
                : `You scored ${score}%. You need ${exam.passingScore}% to pass.`,
        });
    })
);

// Get user's exam attempts
router.get(
    "/attempts/me",
    protect,
    asyncHandler(async (req, res) => {
        const attempts = await ExamAttempt.find({ userId: req.user.id })
            .populate("examId", "title passingScore")
            .sort({ createdAt: -1 });

        res.json(attempts);
    })
);

// Get specific attempt details
router.get(
    "/attempt/:id",
    protect,
    asyncHandler(async (req, res) => {
        const attempt = await ExamAttempt.findById(req.params.id).populate(
            "examId"
        );

        if (!attempt) {
            res.status(404);
            throw new Error("Exam attempt not found");
        }

        // Check if user owns this attempt
        if (attempt.userId.toString() !== req.user.id) {
            res.status(403);
            throw new Error("You can only view your own exam attempts");
        }

        res.json(attempt);
    })
);

// Create exam (admin only - for future implementation)
router.post(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        // Check if user is admin
        if (req.user.role !== "admin") {
            res.status(403);
            throw new Error("Only admins can create exams");
        }

        const exam = await Exam.create(req.body);
        res.status(201).json(exam);
    })
);

module.exports = router;
