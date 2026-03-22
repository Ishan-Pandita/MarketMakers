// index.js - Server entry point
const app = require("./app");
const logger = require("./config/logger");

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  logger.error(
    `Missing required environment variables: ${missing.join(", ")}`
  );
  logger.error("Please check your .env file. See .env.example for reference.");
  process.exit(1);
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
  logger.info(`API: http://localhost:${PORT}/api/v1`);
});
