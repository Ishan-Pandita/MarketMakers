const express = require("express");
const Suggestion = require("../models/Suggestion");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

//Add suggestion
router.post("/", protect, async (req, res) => {
  const { lessonid, text } = req.body;

  const suggestion = await Suggestion.create({
    lessonid,
    userid: req.user.id,
    text,
  });
  res.json(suggestion);
});

//GET suggestion by ID
router.get("/lesson/:lessonid", async (req, res) => {
  const suggestion = await Suggestion.find({
    lessonid: req.params.id,
  }).populate("userid", "name role"); //just for response on ui we add name and role of user also not for database

  res.json(suggestion);
});

module.exports = router;
