import { useEffect, useRef, useState } from "react";

import API from "../services/api";

const normalizeAssetType = (value) => {
  const normalized = String(value || "").toLowerCase();

  if (normalized.includes("crypto")) return "crypto";
  if (normalized.includes("etf")) return "etf";
  if (normalized.includes("bond")) return "bond";
  if (normalized.includes("fund")) return "mutual_fund";
  if (normalized.includes("commodity")) return "commodity";
  return "stock";
};

export default function AssetSearch({ onSelect, currentValue = "" }) {
  const [query, setQuery] = useState(currentValue);
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(currentValue);
  }, [currentValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setSearchError("");
      return undefined;
    }

    const timeoutId = setTimeout(async () => {
      setSearching(true);
      setSearchError("");
      try {
        const res = await API.get("/ai/asset-search", {
          params: { query: trimmedQuery },
        });

        const liveResults = Array.isArray(res.data?.results)
          ? res.data.results.map((item) => ({
              name: item.name || item.symbol,
              ticker: item.symbol,
              quoteSymbol: item.quoteSymbol || item.symbol,
              exchange: item.exchange || "",
              currency: item.currency || "",
              assetType: normalizeAssetType(item.type),
              category: item.exchange || item.country || item.type || "Market",
              provider: item.provider || "market_api",
            }))
          : [];

        setResults(liveResults);
      } catch (error) {
        setResults([]);
        setSearchError("Live market search is unavailable right now.");
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (asset) => {
    const nextLabel = `${asset.name}${asset.ticker ? ` (${asset.ticker})` : ""}`;
    setQuery(nextLabel);
    setShowDropdown(false);
    onSelect?.({
      name: asset.name,
      ticker: asset.ticker,
      quoteSymbol: asset.quoteSymbol,
      exchange: asset.exchange,
      currency: asset.currency,
      assetType: asset.assetType || "stock",
    });
  };

  const handleKeyDown = (event) => {
    if (!showDropdown || results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((current) => (current < results.length - 1 ? current + 1 : 0));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((current) => (current > 0 ? current - 1 : results.length - 1));
      return;
    }

    if (event.key === "Enter" && selectedIndex >= 0) {
      event.preventDefault();
      handleSelect(results[selectedIndex]);
    }

    if (event.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-1.5 block text-sm font-semibold text-slate-body">
        Search asset
      </label>
      <p className="mb-2 text-xs text-slate-muted dark:text-gray-500">
        Live search via market API. Search results are not coming from your app database.
      </p>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-muted">
          Search
        </span>
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedIndex(-1);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder="AAPL, BTC, HDFC Bank, Nifty 50 ETF..."
          className="input-field pl-16"
          autoComplete="off"
        />
      </div>

      {showDropdown && (
        <div className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-slate-border/60 bg-white shadow-elevated dark:border-dark-border/30 dark:bg-dark-card">
          {!query.trim() && (
            <div className="px-4 py-4 text-sm text-slate-muted dark:text-gray-500">
              Start typing to search live market symbols.
            </div>
          )}

          {searching && (
            <div className="px-4 py-3 text-sm text-slate-muted dark:text-gray-500">
              Searching live market symbols...
            </div>
          )}

          {!searching && searchError && (
            <div className="px-4 py-4 text-sm text-red-500">
              {searchError}
            </div>
          )}

          {!searching && query.trim() && results.length === 0 && (
            <div className="px-4 py-4 text-sm text-slate-muted dark:text-gray-500">
              No live market matches found for this search.
            </div>
          )}

          {!searching &&
            results.map((asset, index) => (
              <button
                key={`${asset.ticker || asset.name}-${index}`}
                type="button"
                onClick={() => handleSelect(asset)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                  selectedIndex === index
                    ? "bg-indigo-50 text-indigo-700 dark:bg-cyan-400/10 dark:text-cyan-300"
                    : "text-slate-body hover:bg-surface-subtle dark:text-gray-300 dark:hover:bg-dark-elevated"
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{asset.name}</div>
                  <div className="mt-1 flex items-center gap-2 text-[11px]">
                    {asset.ticker && (
                      <span className="rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-slate-muted dark:bg-dark-surface dark:text-gray-500">
                        {asset.ticker}
                      </span>
                    )}
                    {asset.exchange && (
                      <span className="rounded bg-surface-subtle px-1.5 py-0.5 font-semibold text-slate-muted dark:bg-dark-surface dark:text-gray-500">
                        {asset.exchange}
                      </span>
                    )}
                    <span className="truncate text-slate-muted dark:text-gray-500">
                      {asset.category}
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-bold capitalize text-indigo-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  {String(asset.assetType || "stock").replace("_", " ")}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
