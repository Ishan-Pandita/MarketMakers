const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const checkContributor = require("../middleware/checkContributor");
const { moduleValidator } = require("../middleware/validators");
const {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
} = require("../controllers/moduleController");

const router = express.Router();

router.post("/", protect, checkContributor, moduleValidator, asyncHandler(createModule));
router.get("/", asyncHandler(getModules));
router.get("/:id", asyncHandler(getModule));
router.put("/:id", protect, checkContributor, asyncHandler(updateModule));
router.delete("/:id", protect, checkContributor, asyncHandler(deleteModule));

module.exports = router;
