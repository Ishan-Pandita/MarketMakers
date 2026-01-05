const express = require("express");
const Lesson = require("../models/Lesson");

const router = express.Router();

//to add lesson
router.post("/", async (req, res) => {
  const lesson = await Lesson.create(req.body);
  res.json(lesson);
});

//get lesson by module
router.get("/module/:moduleID", async (req, res) => {
  const lessons = await Lesson.find({
    moduleID: req.params.moduleID, //checks db matches the id in url with the id in db and give lesson
  }).sort({ order: 1 });

  res.json(lessons);
});

//get single lesson
router.get("/:id", async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  res.json(lesson);
});

module.exports = router;
