// app.js - Express app setup
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const connectDB = require("./config/db");
const logger = require("./config/logger");
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
const portfolioRoutes = require("./routes/portfolioRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS - restricted to frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Request logging
app.use(
  morgan("short", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Body parsing with size limits
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased from 100 to 1000 to prevent 429 errors during dev/normal usage
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});
app.use("/api/", globalLimiter);

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Increased from 10 to 50 auth attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts, please try again later" },
});

// Routes (versioned under /api/v1)
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/modules", moduleRoutes);
app.use("/api/v1/lessons", lessonRoutes);
app.use("/api/v1/suggestions", suggestionRoutes);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/exams", examRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/portfolio", portfolioRoutes);
app.use("/api/v1/ai", aiRoutes);

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
  res.json({ message: "MarketMakers API v1" });
});

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
