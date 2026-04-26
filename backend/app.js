// app.js - Express app setup
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
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
const watchlistRoutes = require("./routes/watchlistRoutes");

const app = express();

const DEFAULT_DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

const parseConfiguredOrigins = () =>
  [process.env.FRONTEND_URL, process.env.CORS_ORIGINS]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

const allowedOrigins = [
  ...new Set([
    ...(process.env.NODE_ENV === "production" ? [] : DEFAULT_DEV_ORIGINS),
    ...parseConfiguredOrigins(),
  ]),
];

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
  logger.warn(
    "No FRONTEND_URL or CORS_ORIGINS configured in production; browser requests will be blocked by CORS"
  );
}

// CORS - allow configured browser origins and common local dev origins
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      logger.warn(`Blocked CORS origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
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
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased from 100 to 1000 to prevent 429 errors during dev/normal usage
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});
app.use("/api/", globalLimiter);

// Routes (versioned under /api/v1)
app.use("/api/v1/auth", authRoutes);
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
app.use("/api/v1/watchlist", watchlistRoutes);
app.use("/api/v1/ai", aiRoutes);

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    service: "marketmakers-backend",
    timestamp: new Date().toISOString(),
    mongo:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
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
