import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Bot, Briefcase, Pencil, Plus, Trash2 } from "lucide-react";

import AssetSearch from "../components/AssetSearch";
import LoadingSpinner from "../components/LoadingSpinner";
import PortfolioChartsTab from "../components/portfolio/PortfolioChartsTab";
import PortfolioOverviewTab from "../components/portfolio/PortfolioOverviewTab";
import PortfolioSimulatorTab from "../components/portfolio/PortfolioSimulatorTab";
import usePageTitle from "../hooks/usePageTitle";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api";

const TABS = ["overview", "assets", "charts", "simulate"];
const formatCurrency = (value = 0) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number(value || 0) % 1 === 0 ? 0 : 2,
  })}`;
const formatPrice = (value) => (value === null || value === undefined ? "Awaiting live quote" : formatCurrency(value));
const formatSignedCurrency = (value = 0) =>
  `${Number(value || 0) >= 0 ? "+" : "-"}${formatCurrency(Math.abs(Number(value || 0)))}`;

function Portfolio() {
  usePageTitle("Portfolio");
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submittingAsset, setSubmittingAsset] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [portfolio, setPortfolio] = useState({ assets: [], totalValue: 0, history: [] });
  const [summary, setSummary] = useState({ totalValue: 0, assetCount: 0, allocation: [], history: [], topAssets: [] });
  const [liveData, setLiveData] = useState({
    assets: [],
    totalCurrentValue: 0,
    totalGainLoss: null,
    totalGainLossPct: null,
    priceCoverage: {
      totalAssets: 0,
      pnlReadyCount: 0,
      missingPurchasePriceCount: 0,
    },
  });
  const [healthScore, setHealthScore] = useState({ score: 0, riskLevel: "N/A" });
  const [analysis, setAnalysis] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    quoteSymbol: "",
    exchange: "",
    currency: "",
    amount: "",
    assetType: "stock",
    purchasePrice: "",
  });
  const [simulationForm, setSimulationForm] = useState({ initialAmount: 0, monthlyInvestment: 5000, returnRate: 10, years: 10 });

  const fetchWorkspace = async ({ initial = false } = {}) => {
    if (initial) setLoading(true);
    try {
      const [portfolioRes, summaryRes, liveRes, healthRes] = await Promise.allSettled([
        API.get("/portfolio"),
        API.get("/portfolio/summary"),
        API.get("/portfolio/live-values"),
        API.get("/ai/health-score"),
      ]);
      if (portfolioRes.status === "fulfilled") setPortfolio(portfolioRes.value.data);
      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value.data);
      if (liveRes.status === "fulfilled") setLiveData(liveRes.value.data);
      if (healthRes.status === "fulfilled") setHealthScore(healthRes.value.data);
    } finally {
      if (initial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace({ initial: true });
    const intervalId = setInterval(() => fetchWorkspace(), 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const prefillAsset = location.state?.prefillAsset;
    if (location.state?.openAssetForm || prefillAsset) {
      setActiveTab("assets");
      setShowAssetForm(true);
    }
    if (prefillAsset) {
      setFormData({
        name: prefillAsset.name || "",
        ticker: prefillAsset.ticker || "",
        quoteSymbol: prefillAsset.quoteSymbol || "",
        exchange: prefillAsset.exchange || "",
        currency: prefillAsset.currency || "",
        amount: prefillAsset.amount || "",
        assetType: prefillAsset.assetType || "stock",
        purchasePrice: prefillAsset.purchasePrice || "",
      });
    }
    if (location.state?.openAssetForm || prefillAsset) {
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    const baseValue = Math.round(liveData.totalCurrentValue || summary.totalValue || portfolio.totalValue || 0);
    setSimulationForm((current) => (current.initialAmount > 0 ? current : { ...current, initialAmount: baseValue }));
  }, [liveData.totalCurrentValue, portfolio.totalValue, summary.totalValue]);

  const resetAssetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      ticker: "",
      quoteSymbol: "",
      exchange: "",
      currency: "",
      amount: "",
      assetType: "stock",
      purchasePrice: "",
    });
  };

  const handleEdit = (asset) => {
    setActiveTab("assets");
    setShowAssetForm(true);
    setEditingId(asset._id);
    setFormData({
      name: asset.name,
      ticker: asset.ticker || "",
      quoteSymbol: asset.quoteSymbol || "",
      exchange: asset.exchange || "",
      currency: asset.currency || "",
      amount: asset.amount || "",
      assetType: asset.assetType || "stock",
      purchasePrice: asset.purchasePrice || "",
    });
  };

  const handleAssetSubmit = async (event) => {
    event.preventDefault();
    setSubmittingAsset(true);
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        purchasePrice: formData.purchasePrice === "" ? "" : Number(formData.purchasePrice),
      };
      if (editingId) {
        await API.put(`/portfolio/assets/${editingId}`, payload);
        toast.success("Asset updated.");
      } else {
        await API.post("/portfolio/assets", payload);
        toast.success("Asset added.");
      }
      await fetchWorkspace();
      setShowAssetForm(false);
      resetAssetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save this asset.");
    } finally {
      setSubmittingAsset(false);
    }
  };

  const handleDelete = async (assetId) => {
    if (!window.confirm("Remove this asset from your portfolio?")) return;
    try {
      await API.delete(`/portfolio/assets/${assetId}`);
      await fetchWorkspace();
      toast.success("Asset removed.");
    } catch {
      toast.error("Could not remove this asset.");
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await API.post("/ai/analyze");
      setAnalysis(res.data);
      toast.success("Portfolio analysis ready.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Portfolio analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSimulation = async (event) => {
    event.preventDefault();
    setSimulationLoading(true);
    try {
      const res = await API.post("/ai/simulate", simulationForm);
      setSimulationResult(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Simulation failed.");
    } finally {
      setSimulationLoading(false);
    }
  };

  const assets = liveData.assets?.length
    ? liveData.assets
    : (portfolio.assets || []).map((asset) => ({
        ...asset,
        currentValue: null,
        gainLossAmt: null,
        gainLossPct: null,
        hasPurchasePrice: Number(asset.purchasePrice) > 0,
        hasLivePrice: false,
        canCalculatePnL: false,
      }));

  const pieData = useMemo(() => {
    if (assets.length === 0) {
      return (summary.allocation || []).map((item) => ({
        name: item.type.replaceAll("_", " "),
        value: item.value,
        percentage: item.percentage,
      }));
    }

    const allocationMap = assets.reduce((accumulator, asset) => {
      const key = String(asset.assetType || "other");
      const assetValue = Number(asset.currentValue || asset.amount || 0);
      accumulator[key] = (accumulator[key] || 0) + assetValue;
      return accumulator;
    }, {});

    const totalAllocationValue = Object.values(allocationMap).reduce(
      (sum, value) => sum + Number(value || 0),
      0
    );

    return Object.entries(allocationMap).map(([type, value]) => ({
      name: type.replaceAll("_", " "),
      value: Number(value.toFixed(2)),
      percentage:
        totalAllocationValue > 0
          ? Math.round((Number(value) / totalAllocationValue) * 100)
          : 0,
    }));
  }, [assets, summary.allocation]);

  const historyData = useMemo(
    () =>
      (summary.history || []).map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: item.totalValue,
      })),
    [summary.history]
  );

  const topAssets = [...assets]
    .sort((a, b) => (b.currentValue || b.amount || 0) - (a.currentValue || a.amount || 0))
    .slice(0, 5);

  if (loading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${isDark ? "bg-dark-bg" : "bg-surface"}`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-80px)] pb-20 pt-8 ${isDark ? "bg-dark-bg" : "bg-surface"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border p-6 shadow-elevated sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="badge badge-info mb-4">Portfolio workspace</span>
              <h1 className="text-3xl font-extrabold tracking-tight font-display sm:text-4xl">Manage, analyze, and simulate in one place.</h1>
              <p className={`mt-3 max-w-2xl text-sm leading-relaxed sm:text-base ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                The old portfolio dashboard split is gone. Your live values, health score, AI analysis,
                asset management, and growth simulator now share the same page.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => { setActiveTab("assets"); setShowAssetForm(true); resetAssetForm(); }} className="btn-outline inline-flex items-center gap-2 px-5 py-3 text-sm">
                <Plus className="h-4 w-4" /> Add asset
              </button>
              <button type="button" onClick={() => navigate("/chatbot", { state: { prefillMessage: "Review my portfolio and tell me what stands out.", autoSend: true } })} className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm">
                <Bot className="h-4 w-4" /> Ask the assistant
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Live value",
                value:
                  liveData.priceCoverage?.pnlReadyCount > 0
                    ? formatCurrency(liveData.totalCurrentValue || 0)
                    : "Awaiting quotes",
              },
              {
                label: "P&L",
                value:
                  liveData.totalGainLoss === null
                    ? "Awaiting inputs"
                    : `${liveData.totalGainLoss >= 0 ? "+" : ""}${formatCurrency(liveData.totalGainLoss || 0)}`,
                accent:
                  liveData.totalGainLoss === null
                    ? ""
                    : liveData.totalGainLoss >= 0
                      ? "text-emerald-500"
                      : "text-red-500",
              },
              { label: "Health score", value: `${healthScore.score || 0}/100`, accent: healthScore.score >= 75 ? "text-emerald-500" : healthScore.score >= 50 ? "text-amber-500" : "text-red-500" },
              { label: "Assets", value: summary.assetCount || portfolio.assets?.length || 0 },
            ].map((card) => (
              <div key={card.label} className={`rounded-3xl border px-5 py-5 ${isDark ? "border-dark-border/30 bg-dark-card/80" : "border-slate-border/60 bg-white"}`}>
                <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-slate-muted"}`}>{card.label}</div>
                <div className={`mt-3 text-2xl font-extrabold ${card.accent || ""}`}>{card.value}</div>
                {card.label === "Live value" && (
                  <div className={`mt-1 text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                    {liveData.priceCoverage?.pnlReadyCount || 0}/{liveData.priceCoverage?.totalAssets || summary.assetCount || 0} assets priced live
                  </div>
                )}
                {card.label === "P&L" && (
                  <div className={`mt-1 text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                    {liveData.totalGainLossPct === null
                      ? liveData.priceCoverage?.missingPurchasePriceCount > 0
                        ? "Add buy price to calculate current P&L."
                        : "Waiting for live market quotes."
                      : `${liveData.totalGainLossPct || 0}% across priced assets`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                activeTab === tab
                  ? isDark ? "bg-cyan-400/10 text-cyan-300" : "bg-indigo-50 text-indigo-700"
                  : isDark ? "bg-dark-elevated text-gray-400 hover:text-cyan-300" : "bg-white text-slate-muted hover:text-indigo-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {summary.assetCount === 0 && activeTab !== "simulate" ? (
          <div className="card mt-6 text-center">
            <Briefcase className={`mx-auto h-12 w-12 ${isDark ? "text-gray-500" : "text-slate-muted"}`} />
            <h2 className="mt-4 text-2xl font-bold">Your portfolio is empty</h2>
            <p className={`mx-auto mt-3 max-w-xl text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>
              Add your first asset to unlock allocation charts, live P&amp;L, health scoring, AI analysis, and portfolio-aware chat guidance.
            </p>
            <button type="button" onClick={() => { setActiveTab("assets"); setShowAssetForm(true); }} className="btn-primary mt-6 inline-flex items-center gap-2 px-5 py-3 text-sm">
              <Plus className="h-4 w-4" /> Add your first asset
            </button>
          </div>
        ) : null}

        {activeTab === "overview" && summary.assetCount > 0 && (
          <PortfolioOverviewTab
            analysis={analysis}
            analyzing={analyzing}
            healthScore={healthScore}
            historyData={historyData}
            isDark={isDark}
            onAnalyze={handleAnalyze}
            pieData={pieData}
            topAssets={topAssets}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === "assets" && (
          <div className="mt-6 space-y-6">
            {showAssetForm && (
              <div className="card">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">{editingId ? "Edit asset" : "Add a new asset"}</h2>
                    <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                      Search a live symbol, then enter the amount you invested and the buy price per unit so current P&amp;L can be calculated.
                    </p>
                  </div>
                  <button type="button" onClick={() => { setShowAssetForm(false); resetAssetForm(); }} className="btn-outline px-4 py-2.5 text-sm">Close</button>
                </div>

                <form onSubmit={handleAssetSubmit} className="grid gap-4 lg:grid-cols-2">
                  <div className="lg:col-span-2">
                    <AssetSearch
                      currentValue={formData.name ? `${formData.name}${formData.ticker ? ` (${formData.ticker})` : ""}` : ""}
                      onSelect={({ name, ticker, quoteSymbol, exchange, currency, assetType }) =>
                        setFormData((current) => ({
                          ...current,
                          name,
                          ticker: ticker || "",
                          quoteSymbol: quoteSymbol || "",
                          exchange: exchange || "",
                          currency: currency || "",
                          assetType: assetType || current.assetType,
                        }))
                      }
                    />
                  </div>
                  <input className="input-field" required value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} placeholder="Asset name" />
                  <input
                    className="input-field"
                    value={formData.ticker}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        ticker: event.target.value.toUpperCase(),
                        quoteSymbol: "",
                        exchange: "",
                        currency: "",
                      }))
                    }
                    placeholder="Ticker"
                  />
                  <select className="input-field" value={formData.assetType} onChange={(event) => setFormData((current) => ({ ...current, assetType: event.target.value }))}>
                    <option value="stock">Stock</option>
                    <option value="crypto">Crypto</option>
                    <option value="etf">ETF</option>
                    <option value="bond">Bond</option>
                    <option value="mutual_fund">Mutual Fund</option>
                    <option value="commodity">Commodity</option>
                    <option value="other">Other</option>
                  </select>
                  <input className="input-field" type="number" required min="0" step="0.01" value={formData.amount} onChange={(event) => setFormData((current) => ({ ...current, amount: event.target.value }))} placeholder="Amount invested" />
                  <input className="input-field" type="number" min="0" step="0.01" value={formData.purchasePrice} onChange={(event) => setFormData((current) => ({ ...current, purchasePrice: event.target.value }))} placeholder="Buy price per unit" />
                  <div className="lg:col-span-2">
                    <p className={`mb-3 text-xs ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                      P&amp;L uses: invested amount + buy price per unit + live market price from the API.
                    </p>
                    <button type="submit" disabled={submittingAsset} className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm">
                      <Plus className="h-4 w-4" /> {submittingAsset ? "Saving..." : editingId ? "Update asset" : "Add to portfolio"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid gap-4 xl:grid-cols-2">
              {assets.map((asset) => (
                <div key={asset._id} className="card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold">{asset.name}</h3>
                        {asset.ticker && <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${isDark ? "bg-cyan-400/10 text-cyan-300" : "bg-indigo-50 text-indigo-700"}`}>{asset.ticker}</span>}
                      </div>
                      <p className={`mt-2 text-sm capitalize ${isDark ? "text-gray-500" : "text-slate-muted"}`}>{String(asset.assetType || "stock").replace("_", " ")}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEdit(asset)} className="btn-outline px-3 py-2 text-sm"><Pencil className="h-4 w-4" /></button>
                      <button type="button" onClick={() => handleDelete(asset._id)} className="btn-outline px-3 py-2 text-sm"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Cost basis", value: formatCurrency(asset.costBasis || asset.amount) },
                      { label: "Current value", value: asset.currentValue === null ? "Awaiting live quote" : formatCurrency(asset.currentValue || 0) },
                      {
                        label: "Gain / loss",
                        value:
                          asset.gainLossAmt === null
                            ? asset.hasPurchasePrice
                              ? "Awaiting live quote"
                              : "Add buy price"
                            : `${formatSignedCurrency(asset.gainLossAmt || 0)} (${asset.gainLossPct || 0}%)`,
                        accent:
                          asset.gainLossAmt === null
                            ? ""
                            : asset.gainLossAmt >= 0
                              ? "text-emerald-500"
                              : "text-red-500",
                      },
                    ].map((item) => (
                      <div key={item.label} className={`rounded-2xl border px-4 py-3 ${isDark ? "border-dark-border/30 bg-dark-elevated" : "border-slate-border/60 bg-surface-subtle"}`}>
                        <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-slate-muted"}`}>{item.label}</div>
                        <div className={`mt-2 text-lg font-bold ${item.accent || ""}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${isDark ? "border-dark-border/30 bg-dark-elevated text-gray-300" : "border-slate-border/60 bg-surface-subtle text-slate-body"}`}>
                    {asset.hasPurchasePrice ? (
                      <span>
                        Buy at <strong>{formatCurrency(asset.purchasePrice)}</strong>
                        {asset.quantity ? ` • Approx. ${Number(asset.quantity).toLocaleString("en-US", { maximumFractionDigits: 4 })} units` : ""}
                        {asset.hasLivePrice ? ` • Live API price ${formatPrice(asset.livePrice)}` : " • Live quote unavailable right now"}
                      </span>
                    ) : (
                      <span>
                        Add the buy price per unit to calculate current value and P&amp;L from the live API quote.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "charts" && summary.assetCount > 0 && (
          <PortfolioChartsTab historyData={historyData} isDark={isDark} pieData={pieData} formatCurrency={formatCurrency} />
        )}

        {activeTab === "simulate" && (
          <PortfolioSimulatorTab
            formatCurrency={formatCurrency}
            isDark={isDark}
            onChange={(key, value) => setSimulationForm((current) => ({ ...current, [key]: value }))}
            onSubmit={handleSimulation}
            result={simulationResult}
            simulationForm={simulationForm}
            simulationLoading={simulationLoading}
          />
        )}

        {activeTab === "overview" && summary.assetCount > 0 && (
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={() => navigate("/chatbot", { state: { prefillMessage: "Based on my holdings, what should I keep learning next?", autoSend: true } })} className="btn-outline inline-flex items-center gap-2 px-5 py-3 text-sm">
              Continue with the assistant <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
