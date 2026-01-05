const express = require("express");
const Module = require("../models/Modules");

const router = express.Router();

//to create module
router.post("/", async (req, res) => {
  const module = await Module.create(req.body);
  res.json(module);
});

//get all modules
router.get("/", async (req, res) => {
  const modules = await Module.find().sort({ order: 1 });
  res.json(modules);
});

module.exports = router;
