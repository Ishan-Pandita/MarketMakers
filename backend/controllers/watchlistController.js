/**
 * Watchlist controller — extracted from watchlistRoutes.js for proper MVC separation.
 */
const Watchlist = require("../models/Watchlist");
const { callAIService } = require("../services/aiClient");

const getWatchlist = async (req, res) => {
  const watchlist = await Watchlist.findOne({ userId: req.user.id });
  res.json(watchlist?.items || []);
};

const getWatchlistLiveValues = async (req, res) => {
  const watchlist = await Watchlist.findOne({ userId: req.user.id });
  const items = watchlist?.items || [];

  if (items.length === 0) {
    return res.json({ items: [] });
  }

  let prices = {};
  const priceLookups = items
    .map((item) => ({
      symbol: item.symbol,
      quoteSymbol: item.quoteSymbol,
      exchange: item.exchange,
      assetType: item.assetType,
      currency: item.currency,
    }))
    .filter((item) => item.symbol || item.quoteSymbol);

  if (priceLookups.length > 0) {
    try {
      const result = await callAIService("/live-prices", { assets: priceLookups });
      prices = result.prices || {};
    } catch (error) {
      prices = {};
    }
  }

  return res.json({
    items: items.map((item) => {
      const rawPrice =
        prices[item.quoteSymbol || item.symbol] ?? prices[item.symbol] ?? null;
      const hasLivePrice =
        rawPrice !== null && Number.isFinite(Number(rawPrice));

      return {
        ...item.toObject(),
        livePrice: hasLivePrice ? Number(rawPrice) : null,
        hasLivePrice,
        priceSource: hasLivePrice ? "api" : "unavailable",
      };
    }),
  });
};

const addWatchlistItem = async (req, res) => {
  const { symbol, quoteSymbol, exchange, currency, name, assetType, notes } = req.body;
  let watchlist = await Watchlist.findOne({ userId: req.user.id });

  if (!watchlist) {
    watchlist = new Watchlist({ userId: req.user.id, items: [] });
  }

  const normalizedSymbol = symbol.toUpperCase();
  const existingItem = watchlist.items.find(
    (item) => item.symbol === normalizedSymbol
  );

  if (!existingItem) {
    watchlist.items.push({
      symbol: normalizedSymbol,
      quoteSymbol: quoteSymbol?.toUpperCase?.() || undefined,
      exchange: exchange?.toUpperCase?.() || undefined,
      currency: currency?.toUpperCase?.() || undefined,
      name,
      assetType: assetType || "stock",
      notes: notes || "",
    });

    await watchlist.save();
  }

  res.status(201).json(watchlist.items);
};

const deleteWatchlistItem = async (req, res) => {
  const watchlist = await Watchlist.findOne({ userId: req.user.id });

  if (!watchlist) {
    return res.json({ message: "Removed from watchlist" });
  }

  watchlist.items = watchlist.items.filter(
    (item) => item.symbol !== req.params.symbol.toUpperCase()
  );
  await watchlist.save();

  res.json({ message: "Removed from watchlist" });
};

const addToPortfolio = async (req, res) => {
  const watchlist = await Watchlist.findOne({ userId: req.user.id });

  if (!watchlist) {
    res.status(404);
    throw new Error("Watchlist not found");
  }

  const normalizedSymbol = req.params.symbol.toUpperCase();
  const selectedItem = watchlist.items.find(
    (item) => item.symbol === normalizedSymbol
  );

  if (!selectedItem) {
    res.status(404);
    throw new Error("Watchlist item not found");
  }

  watchlist.items = watchlist.items.filter(
    (item) => item.symbol !== normalizedSymbol
  );
  await watchlist.save();

  res.json({
    readyToAdd: true,
    item: {
      name: selectedItem.name,
      ticker: selectedItem.symbol,
      quoteSymbol: selectedItem.quoteSymbol,
      exchange: selectedItem.exchange,
      currency: selectedItem.currency,
      assetType: selectedItem.assetType || "stock",
      amount: 1000,
    },
  });
};

module.exports = {
  getWatchlist,
  getWatchlistLiveValues,
  addWatchlistItem,
  deleteWatchlistItem,
  addToPortfolio,
};
