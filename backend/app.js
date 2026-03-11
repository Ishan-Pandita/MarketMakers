// app.js - Express app setup (separated for testing)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const progressRoutes = require("./routes/progressRoutes");
const searchRoutes = require("./routes/searchRoutes");
const examRoutes = require("./routes/examRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({ message: "Trading Education Platform API" });
});

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
