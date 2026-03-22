// src/pages/PortfolioDashboard.jsx — Charts & Analysis Dashboard
import usePageTitle from "../hooks/usePageTitle";
import { useEffect, useState } from "react";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { PieChart as PieChartIcon, Bot, Lightbulb, Target, RefreshCw } from "lucide-react";

const COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

function PortfolioDashboard() {
  usePageTitle("Portfolio Dashboard");
  const [summary, setSummary] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, healthRes] = await Promise.all([
        API.get("/portfolio/summary"),
        API.get("/ai/health-score"),
      ]);
      setSummary(summaryRes.data);
      setHealthScore(healthRes.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await API.post("/ai/analyze");
      setAnalysis(res.data);
    } catch (err) {
      setAnalysis({
        riskLevel: "Unknown",
        summary: err.response?.data?.message || "Unable to analyze portfolio right now.",
        insights: [],
        suggestions: [],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;

  if (!summary || summary.assetCount === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] pt-8 pb-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <PieChartIcon className="w-16 h-16 mx-auto mb-4 text-slate-border" />
          <h1 className="text-3xl font-extrabold text-slate-heading mb-3 font-display">Portfolio Dashboard</h1>
          <p className="text-slate-muted mb-8">Add assets to your portfolio to see charts and analytics.</p>
          <Link to="/portfolio" className="btn-primary inline-flex items-center gap-2">Go to Portfolio →</Link>
        </div>
      </div>
    );
  }

  const pieData = summary.allocation.map((a) => ({
    name: a.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value: a.value,
    percentage: a.percentage,
  }));

  const historyData = summary.history.map((h, i) => ({
    date: new Date(h.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: h.totalValue,
  }));

  const scoreColor =
    healthScore?.score >= 75 ? "text-emerald-500" :
    healthScore?.score >= 50 ? "text-amber-500" : "text-red-500";

  const scoreRing =
    healthScore?.score >= 75 ? "border-emerald-400" :
    healthScore?.score >= 50 ? "border-amber-400" : "border-red-400";

  return (
    <div className="min-h-[calc(100vh-80px)] pt-8 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-slideIn">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-heading tracking-tight font-display">Portfolio Dashboard</h1>
            <p className="text-slate-muted mt-1">Analytics & AI-powered insights</p>
          </div>
          <div className="flex gap-3">
            <Link to="/portfolio" className="btn-outline flex items-center gap-2 text-sm">Manage Assets</Link>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="btn-primary flex items-center gap-2"
            >
              {analyzing ? (
                <><RefreshCw className="animate-spin w-4 h-4" /> Analyzing...</>
              ) : (
                <><Bot className="w-4 h-4" /> Analyze Portfolio</>
              )}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card text-center p-6">
            <p className="text-xs font-semibold text-slate-muted uppercase tracking-wider mb-1">Total Value</p>
            <p className="text-2xl font-extrabold text-slate-heading">${summary.totalValue?.toLocaleString()}</p>
          </div>
          <div className="card text-center p-6">
            <p className="text-xs font-semibold text-slate-muted uppercase tracking-wider mb-1">Assets</p>
            <p className="text-2xl font-extrabold text-slate-heading">{summary.assetCount}</p>
          </div>
          <div className="card text-center p-6">
            <p className="text-xs font-semibold text-slate-muted uppercase tracking-wider mb-1">Health Score</p>
            <p className={`text-2xl font-extrabold ${scoreColor}`}>{healthScore?.score || 0}/100</p>
          </div>
          <div className="card text-center p-6">
            <p className="text-xs font-semibold text-slate-muted uppercase tracking-wider mb-1">Risk Level</p>
            <p className="text-2xl font-extrabold text-slate-heading">{healthScore?.riskLevel || "N/A"}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart - Asset Allocation */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-heading mb-4">Asset Allocation</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart - Portfolio History */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-heading mb-4">Portfolio Growth</h2>
            {historyData.length > 1 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `$${v.toLocaleString()}`} />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-muted text-sm">
                <p>Add or update assets to see growth history</p>
              </div>
            )}
          </div>
        </div>

        {/* Health Score Breakdown */}
        {healthScore && healthScore.score > 0 && (
          <div className="card mb-8">
            <h2 className="text-lg font-bold text-slate-heading mb-5">Health Score Breakdown</h2>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Score Ring */}
              <div className="flex flex-col items-center justify-center">
                <div className={`w-32 h-32 rounded-full border-8 ${scoreRing} flex items-center justify-center`}>
                  <span className={`text-4xl font-extrabold ${scoreColor}`}>{healthScore.score}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-muted">{healthScore.diversification} Diversification</p>
              </div>
              {/* Breakdown Bars */}
              <div className="flex-1 space-y-4">
                {healthScore.breakdown && Object.entries(healthScore.breakdown).map(([key, info]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-slate-heading capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-slate-muted">{info.score}/{info.max} — {info.detail}</span>
                    </div>
                    <div className="w-full bg-surface-subtle rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-400 to-teal-400 h-2.5 rounded-full transition-all duration-700"
                        style={{ width: `${(info.score / info.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Results */}
        {analysis && (
          <div className="card mb-8 border-indigo-200 animate-slideIn">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-heading">AI Portfolio Analysis</h2>
                <p className="text-xs text-slate-muted">Powered by Gemini AI</p>
              </div>
              <span className={`ml-auto badge ${
                analysis.riskLevel === "Low" ? "badge-success" :
                analysis.riskLevel === "Medium" ? "badge-warning" : "bg-danger/10 text-danger border border-danger/20"
              }`}>
                Risk: {analysis.riskLevel}
              </span>
            </div>

            {analysis.summary && (
              <p className="text-slate-body mb-5 bg-indigo-50/50 p-4 rounded-xl text-sm leading-relaxed">
                {analysis.summary}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.insights && analysis.insights.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-heading mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-indigo-500" /> Insights
                  </h3>
                  <ul className="space-y-2">
                    {analysis.insights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-body">
                        <span className="text-indigo-400 mt-0.5">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-heading mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-teal-500" /> Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-body">
                        <span className="text-teal-400 mt-0.5">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top Holdings */}
        {summary.topAssets && summary.topAssets.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-bold text-slate-heading mb-4">Top Holdings</h2>
            <div className="space-y-3">
              {summary.topAssets.map((asset, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-surface-subtle rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-500">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-heading text-sm">{asset.name}</p>
                      <p className="text-xs text-slate-muted capitalize">{asset.assetType?.replace("_", " ")}</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-heading">
                    ${asset.amount?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioDashboard;
