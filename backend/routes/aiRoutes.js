const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { aiTextValidator, aiChatValidator } = require("../middleware/validators");
const {
  analyzePortfolio,
  getHealthScore,
  simplifyNews,
  chat,
  getChatSessions,
  getChatSession,
  simulate,
} = require("../controllers/aiController");

// All AI routes are protected
router.use(protect);

// Feature 4: AI Portfolio Analyzer
router.post("/analyze", analyzePortfolio);

// Feature 5: Portfolio Health Score
router.get("/health-score", getHealthScore);

// Feature 6: Financial News Simplifier
router.post("/simplify-news", aiTextValidator, simplifyNews);

// Feature 7: AI Financial Chatbot
router.post("/chat", aiChatValidator, chat);
router.get("/chat/sessions", getChatSessions);
router.get("/chat/sessions/:sessionId", getChatSession);

// Feature 8: Financial Scenario Simulator
router.post("/simulate", simulate);

module.exports = router;
