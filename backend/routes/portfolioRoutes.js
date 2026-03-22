const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { portfolioAssetValidator } = require("../middleware/validators");
const {
  getPortfolio,
  addAsset,
  updateAsset,
  deleteAsset,
  getPortfolioSummary,
} = require("../controllers/portfolioController");

// All portfolio routes are protected
router.use(protect);

router.get("/", getPortfolio);
router.get("/summary", getPortfolioSummary);
router.post("/assets", portfolioAssetValidator, addAsset);
router.put("/assets/:assetId", portfolioAssetValidator, updateAsset);
router.delete("/assets/:assetId", deleteAsset);

module.exports = router;
