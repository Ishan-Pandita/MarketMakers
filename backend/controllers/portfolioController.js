const Portfolio = require("../models/Portfolio");
const { callAIService } = require("../services/aiClient");
const { normalizeUpperOrUndefined } = require("../utils/normalize");

const calculateTotalValue = (assets = []) =>
  assets.reduce((sum, asset) => sum + Number(asset.amount || 0), 0);

const compressHistory = (history = []) => {
  if (history.length <= 90) {
    return history;
  }

  const recent = history.slice(-90);
  const older = history.slice(0, -90);
  const weekly = [];
  const seenWeeks = new Set();

  older.forEach((entry) => {
    const date = new Date(entry.date);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekKey = `${date.getUTCFullYear()}-${Math.floor(
      (date - yearStart) / (7 * 24 * 60 * 60 * 1000)
    )}`;

    if (!seenWeeks.has(weekKey)) {
      seenWeeks.add(weekKey);
      weekly.push(entry);
    }
  });

  return [...weekly, ...recent];
};

const applyHistorySnapshot = (portfolio) => {
  const totalValue = calculateTotalValue(portfolio.assets);
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const nextHistory = [...(portfolio.history || [])];
  const lastEntry = nextHistory[nextHistory.length - 1];

  if (lastEntry) {
    const lastDay = new Date(lastEntry.date).toISOString().split("T")[0];
    if (lastDay === today) {
      lastEntry.totalValue = totalValue;
      lastEntry.date = now;
      portfolio.history = compressHistory(nextHistory);
      return;
    }
  }

  nextHistory.push({
    date: now,
    totalValue,
  });

  portfolio.history = compressHistory(nextHistory);
};



const buildLiveAsset = (asset, livePriceMap = {}) => {
  const symbol = asset.ticker || "";
  const quoteSymbol = asset.quoteSymbol || symbol;
  const fallbackPrice =
    Number(asset.purchasePrice) > 0 ? Number(asset.purchasePrice) : null;
  const mappedPrice = livePriceMap[quoteSymbol] ?? livePriceMap[symbol];
  const livePrice =
    Number.isFinite(Number(mappedPrice)) && mappedPrice !== null
      ? Number(Number(mappedPrice).toFixed(2))
      : null;
  const quantity =
    fallbackPrice && fallbackPrice > 0
      ? Number(asset.amount || 0) / fallbackPrice
      : null;
  const canCalculatePnL =
    livePrice !== null && quantity !== null && Number.isFinite(quantity);
  const currentValue =
    canCalculatePnL
      ? Number((quantity * livePrice).toFixed(2))
      : null;
  const costBasis = Number(asset.amount || 0);
  const gainLossAmt =
    currentValue !== null ? Number((currentValue - costBasis).toFixed(2)) : null;
  const gainLossPct =
    gainLossAmt !== null && costBasis > 0
      ? Number(((gainLossAmt / costBasis) * 100).toFixed(2))
      : null;

  return {
    ...asset.toObject(),
    symbol,
    quoteSymbol,
    livePrice,
    quantity: quantity && Number.isFinite(quantity) ? Number(quantity) : null,
    currentValue,
    costBasis,
    gainLossAmt,
    gainLossPct,
    hasPurchasePrice: fallbackPrice !== null,
    hasLivePrice: livePrice !== null,
    canCalculatePnL,
    priceSource: livePrice !== null ? "api" : "unavailable",
    isUp: gainLossAmt === null ? null : gainLossAmt >= 0,
  };
};

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
  const {
    name,
    ticker,
    quoteSymbol,
    exchange,
    currency,
    amount,
    assetType,
    purchasePrice,
    purchaseDate,
  } =
    req.body;

  let portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio) {
    portfolio = new Portfolio({ userId: req.user.id, assets: [] });
  }

  portfolio.assets.push({
    name,
    ticker: normalizeUpperOrUndefined(ticker),
    quoteSymbol: normalizeUpperOrUndefined(quoteSymbol),
    exchange: normalizeUpperOrUndefined(exchange),
    currency: normalizeUpperOrUndefined(currency),
    amount: Number(amount),
    assetType: assetType || "stock",
    purchasePrice:
      purchasePrice !== undefined && purchasePrice !== null && purchasePrice !== ""
        ? Number(purchasePrice)
        : undefined,
    purchaseDate: purchaseDate || new Date(),
  });

  applyHistorySnapshot(portfolio);

  await portfolio.save();
  res.status(201).json(portfolio);
};

// Update an asset
const updateAsset = async (req, res) => {
  const { assetId } = req.params;
  const { name, ticker, quoteSymbol, exchange, currency, amount, assetType, purchasePrice } = req.body;

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
  if (ticker !== undefined) asset.ticker = normalizeUpperOrUndefined(ticker);
  if (quoteSymbol !== undefined) {
    asset.quoteSymbol = normalizeUpperOrUndefined(quoteSymbol);
  }
  if (exchange !== undefined) {
    asset.exchange = normalizeUpperOrUndefined(exchange);
  }
  if (currency !== undefined) {
    asset.currency = normalizeUpperOrUndefined(currency);
  }
  if (amount !== undefined) asset.amount = Number(amount);
  if (assetType) asset.assetType = assetType;
  if (purchasePrice !== undefined) {
    asset.purchasePrice =
      purchasePrice === null || purchasePrice === ""
        ? undefined
        : Number(purchasePrice);
  }

  applyHistorySnapshot(portfolio);

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
  applyHistorySnapshot(portfolio);

  await portfolio.save();
  res.json(portfolio);
};

// Get portfolio summary
const getPortfolioSummary = async (req, res) => {
  const portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio || portfolio.assets.length === 0) {
    return res.json({
      totalValue: 0,
      assetCount: 0,
      allocation: [],
      history: [],
      topAssets: [],
    });
  }

  const allocationMap = {};
  portfolio.assets.forEach((asset) => {
    const type = asset.assetType || "other";
    allocationMap[type] = (allocationMap[type] || 0) + asset.amount;
  });

  const allocation = Object.entries(allocationMap).map(([type, value]) => ({
    type,
    value,
    percentage:
      portfolio.totalValue > 0
        ? Math.round((value / portfolio.totalValue) * 100)
        : 0,
  }));

  res.json({
    totalValue: portfolio.totalValue,
    assetCount: portfolio.assets.length,
    allocation,
    history: portfolio.history,
    topAssets: [...portfolio.assets]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5),
  });
};

// Get live portfolio values
const getPortfolioLiveValues = async (req, res) => {
  const portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio || portfolio.assets.length === 0) {
    return res.json({
      assets: [],
      totalCurrentValue: 0,
      totalCostBasis: 0,
      totalGainLoss: 0,
      totalGainLossPct: 0,
    });
  }

  let prices = {};
  const priceLookups = portfolio.assets
    .map((asset) => ({
      symbol: asset.ticker,
      quoteSymbol: asset.quoteSymbol,
      exchange: asset.exchange,
      assetType: asset.assetType,
      currency: asset.currency,
    }))
    .filter((asset) => asset.symbol || asset.quoteSymbol);

  if (priceLookups.length > 0) {
    try {
      const result = await callAIService("/live-prices", { assets: priceLookups });
      prices = result.prices || {};
    } catch (error) {
      prices = {};
    }
  }

  const assets = portfolio.assets.map((asset) => buildLiveAsset(asset, prices));
  const pnlReadyAssets = assets.filter((asset) => asset.canCalculatePnL);
  const totalCurrentValue = Number(
    pnlReadyAssets.reduce((sum, asset) => sum + Number(asset.currentValue || 0), 0).toFixed(2)
  );
  const totalCostBasis = Number(
    pnlReadyAssets.reduce((sum, asset) => sum + Number(asset.costBasis || 0), 0).toFixed(2)
  );
  const totalGainLoss =
    pnlReadyAssets.length > 0
      ? Number((totalCurrentValue - totalCostBasis).toFixed(2))
      : null;
  const totalGainLossPct =
    totalGainLoss !== null && totalCostBasis > 0
      ? Number(((totalGainLoss / totalCostBasis) * 100).toFixed(2))
      : null;
  const livePriceCount = assets.filter((asset) => asset.hasLivePrice).length;
  const missingPurchasePriceCount = assets.filter(
    (asset) => asset.hasLivePrice && !asset.hasPurchasePrice
  ).length;
  const missingLivePriceCount = assets.filter((asset) => !asset.hasLivePrice).length;

  res.json({
    assets,
    totalCurrentValue,
    totalCostBasis,
    totalGainLoss,
    totalGainLossPct,
    totalInvestedAmount: Number(
      assets.reduce((sum, asset) => sum + Number(asset.costBasis || 0), 0).toFixed(2)
    ),
    priceCoverage: {
      totalAssets: assets.length,
      livePriceCount,
      pnlReadyCount: pnlReadyAssets.length,
      missingLivePriceCount,
      missingPurchasePriceCount,
      hasCompletePnlCoverage: pnlReadyAssets.length === assets.length,
    },
  });
};

module.exports = {
  getPortfolio,
  addAsset,
  updateAsset,
  deleteAsset,
  getPortfolioSummary,
  getPortfolioLiveValues,
};
