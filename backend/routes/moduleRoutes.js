const express = require("express");
const Module = require("../models/Module");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const checkContributor = require("../middleware/checkContributor");
const { getPaginationData } = require("../utils/pagination");

const router = express.Router();

// Create module - only contributors
router.post(
  "/",
  protect,
  checkContributor,
  asyncHandler(async (req, res) => {
    const module = await Module.create(req.body);
    res.status(201).json(module);
  })
);

// Get all modules with pagination
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const totalModules = await Module.countDocuments();
    const pagination = getPaginationData(page, limit, totalModules);

    const modules = await Module.find()
      .sort({ order: 1 })
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage);

    res.json({
      modules,
      pagination,
    });
  })
);

// Get single module
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const module = await Module.findById(req.params.id);

    if (!module) {
      res.status(404);
      throw new Error("Module not found");
    }

    res.json(module);
  })
);

// Update module - only contributors
router.put(
  "/:id",
  protect,
  checkContributor,
  asyncHandler(async (req, res) => {
    const module = await Module.findById(req.params.id);

    if (!module) {
      res.status(404);
      throw new Error("Module not found");
    }

    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedModule);
  })
);

// Delete module - only contributors
router.delete(
  "/:id",
  protect,
  checkContributor,
  asyncHandler(async (req, res) => {
    const module = await Module.findById(req.params.id);

    if (!module) {
      res.status(404);
      throw new Error("Module not found");
    }

    await Module.findByIdAndDelete(req.params.id);

    res.json({ message: "Module deleted successfully" });
  })
);

module.exports = router;
