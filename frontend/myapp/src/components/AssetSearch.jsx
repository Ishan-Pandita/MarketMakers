// src/components/AssetSearch.jsx — Smart autocomplete for financial assets
import { useState, useRef, useEffect } from "react";

// Comprehensive list of popular assets — stocks, crypto, ETFs, indices, commodities
const POPULAR_ASSETS = [
  // US Tech Stocks
  { name: "Apple Inc.", ticker: "AAPL", type: "stock", category: "Tech" },
  { name: "Microsoft Corp.", ticker: "MSFT", type: "stock", category: "Tech" },
  { name: "Alphabet (Google)", ticker: "GOOGL", type: "stock", category: "Tech" },
  { name: "Amazon.com Inc.", ticker: "AMZN", type: "stock", category: "Tech" },
  { name: "NVIDIA Corp.", ticker: "NVDA", type: "stock", category: "Tech" },
  { name: "Meta Platforms", ticker: "META", type: "stock", category: "Tech" },
  { name: "Tesla Inc.", ticker: "TSLA", type: "stock", category: "Tech" },
  { name: "Netflix Inc.", ticker: "NFLX", type: "stock", category: "Tech" },
  { name: "Adobe Inc.", ticker: "ADBE", type: "stock", category: "Tech" },
  { name: "Salesforce Inc.", ticker: "CRM", type: "stock", category: "Tech" },
  { name: "AMD", ticker: "AMD", type: "stock", category: "Tech" },
  { name: "Intel Corp.", ticker: "INTC", type: "stock", category: "Tech" },
  { name: "Broadcom Inc.", ticker: "AVGO", type: "stock", category: "Tech" },
  { name: "Oracle Corp.", ticker: "ORCL", type: "stock", category: "Tech" },
  { name: "PayPal Holdings", ticker: "PYPL", type: "stock", category: "Tech" },
  { name: "Uber Technologies", ticker: "UBER", type: "stock", category: "Tech" },
  { name: "Airbnb Inc.", ticker: "ABNB", type: "stock", category: "Tech" },
  { name: "Shopify Inc.", ticker: "SHOP", type: "stock", category: "Tech" },
  { name: "Palantir Technologies", ticker: "PLTR", type: "stock", category: "Tech" },
  { name: "Snowflake Inc.", ticker: "SNOW", type: "stock", category: "Tech" },

  // US Blue Chips & Finance
  { name: "JPMorgan Chase", ticker: "JPM", type: "stock", category: "Finance" },
  { name: "Goldman Sachs", ticker: "GS", type: "stock", category: "Finance" },
  { name: "Bank of America", ticker: "BAC", type: "stock", category: "Finance" },
  { name: "Visa Inc.", ticker: "V", type: "stock", category: "Finance" },
  { name: "Mastercard Inc.", ticker: "MA", type: "stock", category: "Finance" },
  { name: "Berkshire Hathaway", ticker: "BRK.B", type: "stock", category: "Finance" },
  { name: "Morgan Stanley", ticker: "MS", type: "stock", category: "Finance" },
  { name: "Charles Schwab", ticker: "SCHW", type: "stock", category: "Finance" },

  // Healthcare & Pharma
  { name: "Johnson & Johnson", ticker: "JNJ", type: "stock", category: "Healthcare" },
  { name: "UnitedHealth Group", ticker: "UNH", type: "stock", category: "Healthcare" },
  { name: "Pfizer Inc.", ticker: "PFE", type: "stock", category: "Healthcare" },
  { name: "Moderna Inc.", ticker: "MRNA", type: "stock", category: "Healthcare" },
  { name: "Eli Lilly", ticker: "LLY", type: "stock", category: "Healthcare" },
  { name: "Abbott Laboratories", ticker: "ABT", type: "stock", category: "Healthcare" },

  // Consumer & Retail
  { name: "Walmart Inc.", ticker: "WMT", type: "stock", category: "Consumer" },
  { name: "Coca-Cola Company", ticker: "KO", type: "stock", category: "Consumer" },
  { name: "PepsiCo Inc.", ticker: "PEP", type: "stock", category: "Consumer" },
  { name: "McDonald's Corp.", ticker: "MCD", type: "stock", category: "Consumer" },
  { name: "Nike Inc.", ticker: "NKE", type: "stock", category: "Consumer" },
  { name: "Starbucks Corp.", ticker: "SBUX", type: "stock", category: "Consumer" },
  { name: "Costco Wholesale", ticker: "COST", type: "stock", category: "Consumer" },
  { name: "Procter & Gamble", ticker: "PG", type: "stock", category: "Consumer" },
  { name: "Walt Disney Co.", ticker: "DIS", type: "stock", category: "Consumer" },

  // Energy & Industrial
  { name: "ExxonMobil Corp.", ticker: "XOM", type: "stock", category: "Energy" },
  { name: "Chevron Corp.", ticker: "CVX", type: "stock", category: "Energy" },
  { name: "ConocoPhillips", ticker: "COP", type: "stock", category: "Energy" },
  { name: "NextEra Energy", ticker: "NEE", type: "stock", category: "Energy" },
  { name: "Caterpillar Inc.", ticker: "CAT", type: "stock", category: "Industrial" },
  { name: "Boeing Company", ticker: "BA", type: "stock", category: "Industrial" },
  { name: "Lockheed Martin", ticker: "LMT", type: "stock", category: "Defense" },

  // Indian Stocks
  { name: "Reliance Industries", ticker: "RELIANCE", type: "stock", category: "India" },
  { name: "Tata Consultancy Services", ticker: "TCS", type: "stock", category: "India" },
  { name: "Infosys Ltd.", ticker: "INFY", type: "stock", category: "India" },
  { name: "HDFC Bank", ticker: "HDFCBANK", type: "stock", category: "India" },
  { name: "ICICI Bank", ticker: "ICICIBANK", type: "stock", category: "India" },
  { name: "Wipro Ltd.", ticker: "WIPRO", type: "stock", category: "India" },
  { name: "Bharti Airtel", ticker: "BHARTIARTL", type: "stock", category: "India" },
  { name: "Hindustan Unilever", ticker: "HINDUNILVR", type: "stock", category: "India" },
  { name: "ITC Ltd.", ticker: "ITC", type: "stock", category: "India" },
  { name: "State Bank of India", ticker: "SBIN", type: "stock", category: "India" },
  { name: "Bajaj Finance", ticker: "BAJFINANCE", type: "stock", category: "India" },
  { name: "Adani Enterprises", ticker: "ADANIENT", type: "stock", category: "India" },
  { name: "Tata Motors", ticker: "TATAMOTORS", type: "stock", category: "India" },

  // Crypto
  { name: "Bitcoin", ticker: "BTC", type: "crypto", category: "Crypto" },
  { name: "Ethereum", ticker: "ETH", type: "crypto", category: "Crypto" },
  { name: "Solana", ticker: "SOL", type: "crypto", category: "Crypto" },
  { name: "Cardano", ticker: "ADA", type: "crypto", category: "Crypto" },
  { name: "Polygon", ticker: "MATIC", type: "crypto", category: "Crypto" },
  { name: "Polkadot", ticker: "DOT", type: "crypto", category: "Crypto" },
  { name: "Chainlink", ticker: "LINK", type: "crypto", category: "Crypto" },
  { name: "Avalanche", ticker: "AVAX", type: "crypto", category: "Crypto" },
  { name: "Ripple (XRP)", ticker: "XRP", type: "crypto", category: "Crypto" },
  { name: "Dogecoin", ticker: "DOGE", type: "crypto", category: "Crypto" },
  { name: "Litecoin", ticker: "LTC", type: "crypto", category: "Crypto" },
  { name: "Binance Coin", ticker: "BNB", type: "crypto", category: "Crypto" },

  // ETFs
  { name: "S&P 500 ETF", ticker: "SPY", type: "etf", category: "ETF" },
  { name: "Nasdaq-100 ETF", ticker: "QQQ", type: "etf", category: "ETF" },
  { name: "Dow Jones ETF", ticker: "DIA", type: "etf", category: "ETF" },
  { name: "Total Stock Market ETF", ticker: "VTI", type: "etf", category: "ETF" },
  { name: "Vanguard S&P 500 ETF", ticker: "VOO", type: "etf", category: "ETF" },
  { name: "Emerging Markets ETF", ticker: "VWO", type: "etf", category: "ETF" },
  { name: "International Stock ETF", ticker: "VXUS", type: "etf", category: "ETF" },
  { name: "Real Estate ETF", ticker: "VNQ", type: "etf", category: "ETF" },
  { name: "ARK Innovation ETF", ticker: "ARKK", type: "etf", category: "ETF" },
  { name: "Treasury Bond ETF", ticker: "TLT", type: "etf", category: "ETF" },
  { name: "Gold ETF", ticker: "GLD", type: "etf", category: "ETF" },
  { name: "Nifty 50 ETF", ticker: "NIFTYBEES", type: "etf", category: "India ETF" },

  // Commodities
  { name: "Gold", ticker: "GOLD", type: "commodity", category: "Commodity" },
  { name: "Silver", ticker: "SILVER", type: "commodity", category: "Commodity" },
  { name: "Crude Oil", ticker: "CRUDE", type: "commodity", category: "Commodity" },
  { name: "Natural Gas", ticker: "NATGAS", type: "commodity", category: "Commodity" },
  { name: "Copper", ticker: "COPPER", type: "commodity", category: "Commodity" },

  // Bonds
  { name: "US Treasury 10-Year", ticker: "UST10Y", type: "bond", category: "Bond" },
  { name: "US Treasury 2-Year", ticker: "UST2Y", type: "bond", category: "Bond" },
  { name: "Corporate Bond Fund", ticker: "LQD", type: "bond", category: "Bond" },
  { name: "High Yield Bond ETF", ticker: "HYG", type: "bond", category: "Bond" },

  // Mutual Funds
  { name: "Vanguard 500 Index Fund", ticker: "VFIAX", type: "mutual_fund", category: "Mutual Fund" },
  { name: "Fidelity 500 Index Fund", ticker: "FXAIX", type: "mutual_fund", category: "Mutual Fund" },
  { name: "Vanguard Total Bond Fund", ticker: "VBTLX", type: "mutual_fund", category: "Mutual Fund" },
];

const TYPE_ICONS = {
  stock: "📈",
  crypto: "₿",
  etf: "📊",
  bond: "🏦",
  mutual_fund: "📁",
  commodity: "🪙",
  other: "💼",
};

export default function AssetSearch({ onSelect, currentValue = "" }) {
  const [query, setQuery] = useState(currentValue);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    setSelectedIndex(-1);

    if (value.length < 1) {
      // Show trending assets when empty
      setResults(POPULAR_ASSETS.slice(0, 8));
      setShowDropdown(true);
      return;
    }

    const search = value.toLowerCase();
    const filtered = POPULAR_ASSETS.filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.ticker.toLowerCase().includes(search) ||
        a.category.toLowerCase().includes(search)
    ).slice(0, 10);

    setResults(filtered);
    setShowDropdown(true);
  };

  const handleSelect = (asset) => {
    setQuery(`${asset.name} (${asset.ticker})`);
    setShowDropdown(false);
    onSelect({
      name: asset.name,
      ticker: asset.ticker,
      assetType: asset.type,
    });
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-semibold text-slate-body mb-1.5">
        Search Asset *
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted text-sm">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => handleSearch(query)}
          onKeyDown={handleKeyDown}
          placeholder="Search stocks, crypto, ETFs... (e.g., AAPL, Bitcoin, Nifty)"
          className="w-full pl-9 pr-4 py-2.5 border border-slate-border rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm"
          autoComplete="off"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-border rounded-xl shadow-elevated max-h-72 overflow-y-auto">
          {query.length < 1 && (
            <div className="px-3 py-2 border-b border-slate-border/50">
              <p className="text-[10px] font-semibold text-slate-muted uppercase tracking-wider">Trending</p>
            </div>
          )}
          {results.map((asset, i) => (
            <button
              key={`${asset.ticker}-${i}`}
              onClick={() => handleSelect(asset)}
              className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${
                i === selectedIndex
                  ? "bg-indigo-50 text-indigo-600"
                  : "hover:bg-surface-subtle text-slate-body"
              } ${i === 0 ? "rounded-t-xl" : ""} ${
                i === results.length - 1 ? "rounded-b-xl" : ""
              }`}
            >
              <span className="text-lg flex-shrink-0">{TYPE_ICONS[asset.type] || "💼"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate">{asset.name}</span>
                  <span className="text-[10px] font-mono bg-surface-subtle px-1.5 py-0.5 rounded text-slate-muted flex-shrink-0">
                    {asset.ticker}
                  </span>
                </div>
                <span className="text-[10px] text-slate-muted">{asset.category}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                asset.type === "stock" ? "bg-blue-50 text-blue-600" :
                asset.type === "crypto" ? "bg-orange-50 text-orange-600" :
                asset.type === "etf" ? "bg-green-50 text-green-600" :
                asset.type === "bond" ? "bg-violet-50 text-violet-600" :
                asset.type === "commodity" ? "bg-yellow-50 text-yellow-700" :
                "bg-surface-subtle text-slate-muted"
              }`}>
                {asset.type.replace("_", " ")}
              </span>
            </button>
          ))}
          {query.length >= 1 && results.length < 3 && (
            <div className="px-3 py-2 border-t border-slate-border/50 bg-surface-subtle rounded-b-xl">
              <p className="text-[10px] text-slate-muted">
                Can't find it? Just type a custom name and press Enter.
              </p>
            </div>
          )}
        </div>
      )}

      {/* No results hint */}
      {showDropdown && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-border rounded-xl shadow-elevated p-4 text-center">
          <p className="text-sm text-slate-muted mb-2">No matching assets found</p>
          <p className="text-xs text-slate-muted">
            You can still type a custom asset name manually below.
          </p>
        </div>
      )}
    </div>
  );
}
