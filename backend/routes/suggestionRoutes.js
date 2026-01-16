const express = require("express");
const Suggestion = require("../models/Suggestion");
const protect = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const { suggestionValidator } = require("../middleware/validators");

const router = express.Router();

// Add suggestion
router.post(
  "/",
  protect,
  suggestionValidator,
  asyncHandler(async (req, res) => {
    const { lessonId, text } = req.body;

    const suggestion = await Suggestion.create({
      lessonId,
      userId: req.user.id,
      text,
    });

    res.status(201).json(suggestion);
  })
);

// Get suggestions by lesson
router.get(
  "/lesson/:lessonId",
  asyncHandler(async (req, res) => {
    const suggestions = await Suggestion.find({
      lessonId: req.params.lessonId,
    })
      .populate("userId", "name role")
      .sort({ createdAt: -1 });

    res.json(suggestions);
  })
);

// Update suggestion - only own suggestions
router.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const suggestion = await Suggestion.findById(req.params.id);

    if (!suggestion) {
      res.status(404);
      throw new Error("Suggestion not found");
    }

    // Check if user owns this suggestion
    if (suggestion.userId.toString() !== req.user.id) {
      res.status(403);
      throw new Error("You can only update your own suggestions");
    }

    const updatedSuggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true, runValidators: true }
    );

    res.json(updatedSuggestion);
  })
);

// Delete suggestion - only own suggestions
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const suggestion = await Suggestion.findById(req.params.id);

    if (!suggestion) {
      res.status(404);
      throw new Error("Suggestion not found");
    }

    // Check if user owns this suggestion
    if (suggestion.userId.toString() !== req.user.id) {
      res.status(403);
      throw new Error("You can only delete your own suggestions");
    }

    await Suggestion.findByIdAndDelete(req.params.id);

    res.json({ message: "Suggestion deleted successfully" });
  })
);

module.exports = router;
