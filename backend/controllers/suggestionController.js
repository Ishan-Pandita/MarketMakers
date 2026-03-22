const Suggestion = require("../models/Suggestion");

// Add suggestion
const createSuggestion = async (req, res) => {
  const { lessonId, text } = req.body;

  const suggestion = await Suggestion.create({
    lessonId,
    userId: req.user.id,
    text,
  });

  res.status(201).json(suggestion);
};

// Get suggestions by lesson
const getSuggestions = async (req, res) => {
  const suggestions = await Suggestion.find({
    lessonId: req.params.lessonId,
  })
    .populate("userId", "name role")
    .sort({ createdAt: -1 });

  res.json(suggestions);
};

// Update suggestion - only own suggestions
const updateSuggestion = async (req, res) => {
  const suggestion = await Suggestion.findById(req.params.id);

  if (!suggestion) {
    res.status(404);
    throw new Error("Suggestion not found");
  }

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
};

// Delete suggestion - only own suggestions
const deleteSuggestion = async (req, res) => {
  const suggestion = await Suggestion.findById(req.params.id);

  if (!suggestion) {
    res.status(404);
    throw new Error("Suggestion not found");
  }

  if (suggestion.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error("You can only delete your own suggestions");
  }

  await Suggestion.findByIdAndDelete(req.params.id);

  res.json({ message: "Suggestion deleted successfully" });
};

module.exports = {
  createSuggestion,
  getSuggestions,
  updateSuggestion,
  deleteSuggestion,
};
