const Portfolio = require("../models/Portfolio");

// Get user's portfolio
const getPortfolio = async (req, res) => {
  let portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio) {
    portfolio = await Portfolio.create({ userId: req.user.id, assets: [] });
  }

  res.json(portfolio);
};

// Add asset to portfolio
const addAsset = async (req, res) => {
  const { name, ticker, amount, assetType, purchasePrice, purchaseDate } = req.body;

  let portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio) {
    portfolio = new Portfolio({ userId: req.user.id, assets: [] });
  }

  portfolio.assets.push({
    name,
    ticker,
    amount,
    assetType: assetType || "stock",
    purchasePrice,
    purchaseDate: purchaseDate || new Date(),
  });

  // Record history snapshot
  portfolio.history.push({
    date: new Date(),
    totalValue: portfolio.assets.reduce((sum, a) => sum + a.amount, 0),
  });

  await portfolio.save();
  res.status(201).json(portfolio);
};

// Update an asset
const updateAsset = async (req, res) => {
  const { assetId } = req.params;
  const { name, ticker, amount, assetType, purchasePrice } = req.body;

  const portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio) {
    res.status(404);
    throw new Error("Portfolio not found");
  }

  const asset = portfolio.assets.id(assetId);

  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }

  if (name) asset.name = name;
  if (ticker) asset.ticker = ticker;
  if (amount !== undefined) asset.amount = amount;
  if (assetType) asset.assetType = assetType;
  if (purchasePrice !== undefined) asset.purchasePrice = purchasePrice;

  await portfolio.save();
  res.json(portfolio);
};

// Delete an asset
const deleteAsset = async (req, res) => {
  const { assetId } = req.params;

  const portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio) {
    res.status(404);
    throw new Error("Portfolio not found");
  }

  const asset = portfolio.assets.id(assetId);

  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }

  asset.deleteOne();

  // Record history snapshot
  portfolio.history.push({
    date: new Date(),
    totalValue: portfolio.assets.reduce((sum, a) => sum + a.amount, 0),
  });

  await portfolio.save();
  res.json(portfolio);
};

// Get portfolio summary (for dashboard)
const getPortfolioSummary = async (req, res) => {
  const portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio || portfolio.assets.length === 0) {
    return res.json({
      totalValue: 0,
      assetCount: 0,
      allocation: [],
      history: [],
    });
  }

  // Calculate allocation by type
  const allocationMap = {};
  portfolio.assets.forEach((asset) => {
    const type = asset.assetType || "other";
    allocationMap[type] = (allocationMap[type] || 0) + asset.amount;
  });

  const allocation = Object.entries(allocationMap).map(([type, value]) => ({
    type,
    value,
    percentage: Math.round((value / portfolio.totalValue) * 100),
  }));

  res.json({
    totalValue: portfolio.totalValue,
    assetCount: portfolio.assets.length,
    allocation,
    history: portfolio.history.slice(-30), // Last 30 snapshots
    topAssets: [...portfolio.assets]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5),
  });
};

module.exports = {
  getPortfolio,
  addAsset,
  updateAsset,
  deleteAsset,
  getPortfolioSummary,
};
