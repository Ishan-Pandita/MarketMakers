import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bookmark, LineChart, Plus, Trash2 } from "lucide-react";

import AssetSearch from "../components/AssetSearch";
import LoadingSpinner from "../components/LoadingSpinner";
import usePageTitle from "../hooks/usePageTitle";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api";

function Watchlist() {
  usePageTitle("Watchlist");
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "",
    quoteSymbol: "",
    exchange: "",
    currency: "",
    name: "",
    assetType: "stock",
    notes: "",
  });

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await API.get("/watchlist/live-values");
        setItems(res.data.items || []);
      } catch (error) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
    const intervalId = setInterval(fetchWatchlist, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const refreshWatchlist = async () => {
    const res = await API.get("/watchlist/live-values");
    setItems(res.data.items || []);
  };

  const handleAdd = async (event) => {
    event.preventDefault();

    if (!formData.symbol || !formData.name) {
      toast.error("Pick an asset from search first.");
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/watchlist", formData);
      await refreshWatchlist();
      setFormData({
        symbol: "",
        quoteSymbol: "",
        exchange: "",
        currency: "",
        name: "",
        assetType: "stock",
        notes: "",
      });
      toast.success("Added to watchlist.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save this watchlist item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (symbol) => {
    try {
      await API.delete(`/watchlist/${symbol}`);
      await refreshWatchlist();
      toast.success("Removed from watchlist.");
    } catch (error) {
      toast.error("Could not remove the watchlist item.");
    }
  };

  const handleMoveToPortfolio = async (symbol) => {
    try {
      const res = await API.post(`/watchlist/${symbol}/add-to-portfolio`);
      await refreshWatchlist();
      navigate("/portfolio", {
        state: {
          openAssetForm: true,
          prefillAsset: res.data.item,
        },
      });
      toast.success("Moved into your portfolio flow.");
    } catch (error) {
      toast.error("Could not move this asset to portfolio.");
    }
  };

  if (loading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${isDark ? "bg-dark-bg" : "bg-surface"}`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-80px)] pb-20 pt-8 ${isDark ? "bg-dark-bg" : "bg-surface"}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.2fr]">
          <div className="card">
            <span className="badge badge-info mb-4">Watchlist</span>
            <h1 className="text-3xl font-extrabold tracking-tight font-display">
              Track ideas before they become positions.
            </h1>
            <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>
              Save assets you want to research, monitor live prices, and move them into the
              portfolio workspace when you’re ready.
            </p>

            <form onSubmit={handleAdd} className="mt-6 space-y-4">
              <AssetSearch
                currentValue={
                  formData.name ? `${formData.name} (${formData.symbol})` : ""
                }
                onSelect={({ name, ticker, quoteSymbol, exchange, currency, assetType }) =>
                  setFormData((current) => ({
                    ...current,
                    name,
                    symbol: ticker || "",
                    quoteSymbol: quoteSymbol || "",
                    exchange: exchange || "",
                    currency: currency || "",
                    assetType: assetType || "stock",
                  }))
                }
              />

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-body">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Why are you watching this asset?"
                  className="input-field min-h-[110px] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
              >
                <Plus className="h-4 w-4" />
                {submitting ? "Saving..." : "Add to watchlist"}
              </button>
            </form>
          </div>

          <div className="card">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Live watchlist</h2>
                <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                  Prices refresh automatically every 60 seconds from the market API when data is available.
                </p>
              </div>
              <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${isDark ? "bg-dark-elevated text-cyan-300" : "bg-indigo-50 text-indigo-700"}`}>
                {items.length} item{items.length === 1 ? "" : "s"}
              </div>
            </div>

            {items.length === 0 ? (
              <div className={`rounded-[1.75rem] border border-dashed p-10 text-center ${isDark ? "border-dark-border/30" : "border-slate-border/60"}`}>
                <Bookmark className={`mx-auto h-12 w-12 ${isDark ? "text-gray-500" : "text-slate-muted"}`} />
                <p className={`mt-4 text-sm ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                  Nothing here yet. Add assets on the left to start tracking ideas.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.symbol}
                    className={`rounded-[1.5rem] border px-4 py-4 ${
                      isDark ? "border-dark-border/30 bg-dark-elevated" : "border-slate-border/60 bg-surface-subtle"
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold">{item.name}</h3>
                          <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${isDark ? "bg-cyan-400/10 text-cyan-300" : "bg-white text-indigo-700"}`}>
                            {item.symbol}
                          </span>
                          <span className={`rounded-full px-2 py-1 text-[11px] font-semibold capitalize ${isDark ? "bg-dark-surface text-gray-400" : "bg-white text-slate-muted"}`}>
                            {String(item.assetType || "stock").replace("_", " ")}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${isDark ? "bg-dark-surface text-gray-300" : "bg-white text-slate-heading"}`}>
                            <LineChart className="h-4 w-4" />
                            {item.hasLivePrice ? `$${Number(item.livePrice).toLocaleString()}` : "Live price unavailable"}
                          </div>
                          {item.exchange && (
                            <div className={`${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                              {item.exchange}
                            </div>
                          )}
                          <div className={`${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                            Added {new Date(item.addedAt).toLocaleDateString()}
                          </div>
                        </div>

                        {item.notes && (
                          <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                            {item.notes}
                          </p>
                        )}

                        <p className={`mt-3 text-xs ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                          {item.hasLivePrice
                            ? "Live quote sourced from the market API."
                            : "Live quote not available from the current market API lookup."}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleMoveToPortfolio(item.symbol)}
                          className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm"
                        >
                          Move to portfolio
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.symbol)}
                          className="btn-outline inline-flex items-center gap-2 px-4 py-2.5 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Watchlist;
