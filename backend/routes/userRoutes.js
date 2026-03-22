const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const {
  getContributors,
  getContributorProfile,
} = require("../controllers/userController");

const router = express.Router();

router.get("/contributors", asyncHandler(getContributors));
router.get("/contributors/:id", asyncHandler(getContributorProfile));

module.exports = router;
