const express = require("express");
const Progress = require("../models/Progress");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

//mark lesson as completed

router.post("/", protect, async (req, res) => {
  const { lessonid } = req.body;

  const exists = await Progress.findOne({
    userid: req.user.id,
    lessonid,
  });

  if (exists) {
    return res.json({ message: "Lesson already completed" });
  }

  const progress = await Progress.create({
    userid: req.user.id,
    lessonid,
  });
  res.json(progress);
});

//get user progress
router.get("/me", protect, async (req, res) => {
  const progress = await Progress.find({
    userid: req.user.id,
  }).populate("lessonid", "title");

  res.json(progress);
});

module.exports = router;
