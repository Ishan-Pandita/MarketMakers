const Exam = require("../models/Exam");
const ExamAttempt = require("../models/ExamAttempt");
const User = require("../models/User");
const Course = require("../models/Course");
const { generateCertificate } = require("../utils/certificateGenerator");

// Get all active exams
const getExams = async (req, res) => {
  const exams = await Exam.find({ isActive: true }).select(
    "-questions.correctAnswer"
  );
  res.json(exams);
};

// Get single exam (without correct answers)
const getExam = async (req, res) => {
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
};

// Submit exam attempt
const submitAttempt = async (req, res) => {
  const { answers } = req.body;

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

  // NOTE: Learner-to-contributor upgrade system has been removed.
  // Contributors are approved only by admin through the admin panel.

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
};

// Get user's exam attempts
const getUserAttempts = async (req, res) => {
  const attempts = await ExamAttempt.find({ userId: req.user.id })
    .populate("examId", "title passingScore")
    .sort({ createdAt: -1 });

  res.json(attempts);
};

// Get specific attempt details
const getAttempt = async (req, res) => {
  const attempt = await ExamAttempt.findById(req.params.id).populate("examId");

  if (!attempt) {
    res.status(404);
    throw new Error("Exam attempt not found");
  }

  if (attempt.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error("You can only view your own exam attempts");
  }

  res.json(attempt);
};

// Create exam (admin only)
const createExam = async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only admins can create exams");
  }

  const exam = await Exam.create(req.body);
  res.status(201).json(exam);
};

// Generate certificate for passed attempt
const getCertificate = async (req, res) => {
  const attempt = await ExamAttempt.findById(req.params.id)
    .populate({
      path: "userId",
      select: "name email"
    })
    .populate({
      path: "examId",
      select: "title courseId",
      populate: {
        path: "courseId",
        select: "title instructor",
        populate: {
          path: "instructor",
          select: "name"
        }
      }
    });

  if (!attempt) {
    res.status(404);
    throw new Error("Exam attempt not found");
  }

  // Ensure user owns this attempt
  if (attempt.userId._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to view this certificate");
  }

  // Ensure the user actually passed
  if (!attempt.passed) {
    res.status(400);
    throw new Error("Certificate only available for passed exams");
  }

  const courseName = attempt.examId.courseId ? attempt.examId.courseId.title : "MarketMakers Certification";
  const instructorName = attempt.examId.courseId?.instructor ? attempt.examId.courseId.instructor.name : "MarketMakers Team";

  const certData = {
    learnerName: attempt.userId.name,
    courseName,
    instructorName,
    examTitle: attempt.examId.title,
    score: attempt.score,
    date: attempt.completedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    certificateId: attempt._id.toString().slice(-8).toUpperCase()
  };

  // Set response headers for PDF download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Certificate_${certData.certificateId}.pdf`
  );

  // Generate and pipe the PDF directly to the response
  const doc = generateCertificate(certData);
  doc.pipe(res);
};

module.exports = {
  getExams,
  getExam,
  submitAttempt,
  getUserAttempts,
  getAttempt,
  getCertificate,
  createExam,
};
