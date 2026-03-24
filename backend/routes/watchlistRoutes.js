const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");
const { watchlistItemValidator } = require("../middleware/validators");
const {
  getWatchlist,
  getWatchlistLiveValues,
  addWatchlistItem,
  deleteWatchlistItem,
  addToPortfolio,
} = require("../controllers/watchlistController");

const router = express.Router();

router.use(protect);

router.get("/", asyncHandler(getWatchlist));
router.get("/live-values", asyncHandler(getWatchlistLiveValues));
router.post("/", watchlistItemValidator, asyncHandler(addWatchlistItem));
router.delete("/:symbol", asyncHandler(deleteWatchlistItem));
router.post("/:symbol/add-to-portfolio", asyncHandler(addToPortfolio));

module.exports = router;
