const Course = require("../models/Course");

const TICKER_TAG_MAP = {
  HDFC: ["banking", "finance", "indian-markets"],
  HDFCBANK: ["banking", "finance", "indian-markets"],
  ICICI: ["banking", "finance", "indian-markets"],
  SBIN: ["banking", "finance", "indian-markets"],
  RELIANCE: ["energy", "conglomerate", "indian-markets"],
  TCS: ["technology", "it-sector", "indian-markets"],
  INFY: ["technology", "it-sector", "indian-markets"],
  TSLA: ["electric-vehicles", "technology", "us-markets"],
  AAPL: ["technology", "us-markets"],
  MSFT: ["technology", "us-markets"],
  NVDA: ["technology", "us-markets"],
  BTC: ["crypto", "blockchain", "digital-assets"],
  ETH: ["crypto", "blockchain", "smart-contracts"],
};

const ASSET_TYPE_TAG_MAP = {
  stock: ["equities", "market-basics"],
  crypto: ["crypto", "blockchain", "digital-assets"],
  etf: ["passive-investing", "index-funds", "diversification"],
  bond: ["fixed-income", "debt", "risk-management"],
  mutual_fund: ["fundamentals", "diversification", "beginner"],
  commodity: ["commodities", "inflation-hedge", "raw-materials"],
  other: ["beginner"],
};

const deriveTagsFromAsset = (asset) => {
  const tags = new Set();
  const ticker = asset.ticker?.toUpperCase() || "";

  Object.entries(TICKER_TAG_MAP).forEach(([key, mappedTags]) => {
    if (ticker.startsWith(key)) {
      mappedTags.forEach((tag) => tags.add(tag));
    }
  });

  (ASSET_TYPE_TAG_MAP[asset.assetType] || []).forEach((tag) => tags.add(tag));

  return [...tags];
};

const getRecommendedCourses = async (portfolio, completedCourseIds = []) => {
  const derivedTags = new Set();

  (portfolio?.assets || []).forEach((asset) => {
    deriveTagsFromAsset(asset).forEach((tag) => derivedTags.add(tag));
  });

  if (derivedTags.size === 0) {
    return [];
  }

  return Course.find({
    isActive: true,
    _id: { $nin: completedCourseIds },
    tags: { $in: Array.from(derivedTags) },
  })
    .limit(3)
    .sort({ order: 1 })
    .select("title description tags thumbnail");
};

module.exports = {
  getRecommendedCourses,
};
