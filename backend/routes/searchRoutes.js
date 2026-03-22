const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { search } = require("../controllers/searchController");

const router = express.Router();

router.get("/", asyncHandler(search));

module.exports = router;
