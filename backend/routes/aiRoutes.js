const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const { aiChatValidator } = require("../middleware/validators");
const {
  analyzePortfolio,
  getHealthScore,
  searchAssets,
  chat,
  chatStream,
  getChatSessions,
  getChatSession,
  simulate,
} = require("../controllers/aiController");

const router = express.Router();

router.use(protect);

router.post("/analyze", asyncHandler(analyzePortfolio));
router.get("/health-score", asyncHandler(getHealthScore));
router.get("/asset-search", asyncHandler(searchAssets));
router.post("/chat", aiChatValidator, asyncHandler(chat));
router.post("/chat/stream", aiChatValidator, asyncHandler(chatStream));
router.get("/chat/sessions", asyncHandler(getChatSessions));
router.get("/chat/sessions/:sessionId", asyncHandler(getChatSession));
router.post("/simulate", asyncHandler(simulate));

module.exports = router;
