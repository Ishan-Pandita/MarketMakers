const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const { suggestionValidator } = require("../middleware/validators");
const {
  createSuggestion,
  getSuggestions,
  updateSuggestion,
  deleteSuggestion,
} = require("../controllers/suggestionController");

const router = express.Router();

router.post("/", protect, suggestionValidator, asyncHandler(createSuggestion));
router.get("/lesson/:lessonId", asyncHandler(getSuggestions));
router.put("/:id", protect, asyncHandler(updateSuggestion));
router.delete("/:id", protect, asyncHandler(deleteSuggestion));

module.exports = router;
