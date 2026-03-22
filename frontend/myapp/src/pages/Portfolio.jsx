// src/pages/Portfolio.jsx — Portfolio Management Page
import usePageTitle from "../hooks/usePageTitle";
import { useEffect, useState } from "react";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import AssetSearch from "../components/AssetSearch";
import { LineChart, Bitcoin, BarChart3, Landmark, FolderOpen, Coins, Briefcase, Pencil, Trash2 } from "lucide-react";

const ASSET_TYPES = [
  { value: "stock", label: "Stock", icon: <LineChart size={20} /> },
  { value: "crypto", label: "Crypto", icon: <Bitcoin size={20} /> },
  { value: "etf", label: "ETF", icon: <BarChart3 size={20} /> },
  { value: "bond", label: "Bond", icon: <Landmark size={20} /> },
  { value: "mutual_fund", label: "Mutual Fund", icon: <FolderOpen size={20} /> },
  { value: "commodity", label: "Commodity", icon: <Coins size={20} /> },
  { value: "other", label: "Other", icon: <Briefcase size={20} /> },
];

function Portfolio() {
  usePageTitle("Portfolio");
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    amount: "",
    assetType: "stock",
    purchasePrice: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await API.get("/portfolio");
      setPortfolio(res.data);
    } catch (err) {
      setError("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (editingId) {
        await API.put(`/portfolio/assets/${editingId}`, formData);
      } else {
        await API.post("/portfolio/assets", formData);
      }
      await fetchPortfolio();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save asset");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (assetId) => {
    if (!window.confirm("Remove this asset from your portfolio?")) return;
    try {
      await API.delete(`/portfolio/assets/${assetId}`);
      await fetchPortfolio();
    } catch (err) {
      setError("Failed to delete asset");
    }
  };

  const handleEdit = (asset) => {
    setEditingId(asset._id);
    setFormData({
      name: asset.name,
      ticker: asset.ticker || "",
      amount: asset.amount,
      assetType: asset.assetType,
      purchasePrice: asset.purchasePrice || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", ticker: "", amount: "", assetType: "stock", purchasePrice: "" });
  };

  const getTypeInfo = (type) => ASSET_TYPES.find((t) => t.value === type) || ASSET_TYPES[6];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;

  return (
    <div className="min-h-[calc(100vh-80px)] pt-8 pb-20 bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-slideIn">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-heading tracking-tight font-display">
              My Portfolio
            </h1>
            <p className="text-slate-muted mt-1">Track and manage your investments</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setShowForm(!showForm); setEditingId(null); }}
              className="btn-primary flex items-center gap-2"
            >
              <span className="text-lg">{showForm ? "✕" : "+"}</span>
              {showForm ? "Cancel" : "Add Asset"}
            </button>
          </div>
        </div>

        {/* Portfolio Value Banner */}
        {portfolio && portfolio.assets.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-500 to-teal-500 rounded-2xl p-6 md:p-8 mb-8 shadow-elevated animate-slideIn">
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Total Portfolio Value</p>
            <p className="text-4xl md:text-5xl font-extrabold text-white mt-2 font-display">
              ${portfolio.totalValue?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-white/60 mt-2">
              {portfolio.assets.length} asset{portfolio.assets.length !== 1 ? "s" : ""} in portfolio
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        {/* Add/Edit Asset Form */}
        {showForm && (
          <div className="card mb-8 animate-slideIn border-indigo-200">
            <h2 className="text-lg font-bold text-slate-heading mb-5">
              {editingId ? "Edit Asset" : "Add New Asset"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2 lg:col-span-3">
                <AssetSearch
                  currentValue={formData.name ? `${formData.name}${formData.ticker ? ` (${formData.ticker})` : ''}` : ''}
                  onSelect={({ name, ticker, assetType }) => {
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      ticker: ticker || prev.ticker,
                      assetType: assetType || prev.assetType,
                    }));
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-body mb-1.5">Asset Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Auto-filled from search or type manually"
                  className="w-full px-4 py-2.5 border border-slate-border rounded-xl bg-surface-subtle focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-body mb-1.5">Ticker Symbol</label>
                <input
                  type="text"
                  value={formData.ticker}
                  onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
                  placeholder="e.g. TSLA, BTC"
                  className="w-full px-4 py-2.5 border border-slate-border rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-body mb-1.5">Amount ($) *</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="500.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-slate-border rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-body mb-1.5">Asset Type</label>
                <select
                  value={formData.assetType}
                  onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-border rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm"
                >
                  {ASSET_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-body mb-1.5">Purchase Price ($)</label>
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  placeholder="Optional"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-slate-border rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {submitting ? "Saving..." : editingId ? "Update Asset" : "Add to Portfolio"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Assets Grid */}
        {portfolio && portfolio.assets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.assets.map((asset) => {
              const typeInfo = getTypeInfo(asset.assetType);
              const percentage = portfolio.totalValue > 0
                ? ((asset.amount / portfolio.totalValue) * 100).toFixed(1)
                : 0;
              return (
                <div key={asset._id} className="card group hover:border-indigo-200 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
                        {typeInfo.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-heading group-hover:text-indigo-500 transition-colors">
                          {asset.name}
                        </h3>
                        {asset.ticker && (
                          <span className="text-xs font-mono text-slate-muted">{asset.ticker}</span>
                        )}
                      </div>
                    </div>
                    <span className="badge bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px]">
                      {typeInfo.label}
                    </span>
                  </div>
                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <p className="text-2xl font-extrabold text-slate-heading">
                        ${asset.amount?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-muted mt-1">{percentage}% of portfolio</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(asset)}
                        className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 flex items-center justify-center transition-colors"
                        title="Edit"
                      ><Pencil size={14} /></button>
                      <button
                        onClick={() => handleDelete(asset._id)}
                        className="w-8 h-8 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 flex items-center justify-center transition-colors"
                        title="Delete"
                      ><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {/* Allocation bar */}
                  <div className="mt-3 w-full bg-surface-subtle rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-400 to-teal-400 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 card">
            <Briefcase className="w-16 h-16 mx-auto text-slate-border mb-4" />
            <h2 className="text-xl font-bold text-slate-heading mb-2">Your portfolio is empty</h2>
            <p className="text-slate-muted mb-6">Add your first investment to start tracking your portfolio.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <span className="text-lg">+</span> Add Your First Asset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
