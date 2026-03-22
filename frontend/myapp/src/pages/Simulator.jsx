// src/pages/Simulator.jsx — Financial Scenario Simulator (Feature 8)
import usePageTitle from "../hooks/usePageTitle";
import { useState } from "react";
import API from "../services/api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { Rocket, Bot, TrendingUp, RefreshCw } from "lucide-react";

function Simulator() {
  usePageTitle("Simulator");
  const [formData, setFormData] = useState({
    monthlyInvestment: 5000,
    returnRate: 10,
    years: 10,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/ai/simulate", formData);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Simulation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    { label: "Conservative", monthly: 5000, rate: 6, years: 15 },
    { label: "Moderate", monthly: 10000, rate: 10, years: 10 },
    { label: "Aggressive", monthly: 15000, rate: 15, years: 5 },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] pt-8 pb-20 bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 animate-slideIn">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 mb-4 text-emerald-600">
            <Rocket className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-heading tracking-tight font-display">
            Investment Simulator
          </h1>
          <p className="text-slate-muted mt-2 max-w-lg mx-auto">
            See how your investments could grow over time with the power of compound interest.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-lg font-bold text-slate-heading mb-5">Configure Simulation</h2>

              {/* Presets */}
              <div className="flex gap-2 mb-6">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setFormData({ monthlyInvestment: p.monthly, returnRate: p.rate, years: p.years })}
                    className="flex-1 text-xs py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSimulate} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-body mb-1.5">
                    Monthly Investment (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyInvestment}
                    onChange={(e) => setFormData({ ...formData, monthlyInvestment: Number(e.target.value) })}
                    min="100"
                    className="w-full px-4 py-2.5 border border-slate-border rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm"
                    required
                  />
                  <input
                    type="range"
                    value={formData.monthlyInvestment}
                    onChange={(e) => setFormData({ ...formData, monthlyInvestment: Number(e.target.value) })}
                    min="500"
                    max="100000"
                    step="500"
                    className="w-full mt-2 accent-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-body mb-1.5">
                    Expected Annual Return (%)
                  </label>
                  <input
                    type="number"
                    value={formData.returnRate}
                    onChange={(e) => setFormData({ ...formData, returnRate: Number(e.target.value) })}
                    min="1"
                    max="50"
                    step="0.5"
                    className="w-full px-4 py-2.5 border border-slate-border rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm"
                    required
                  />
                  <input
                    type="range"
                    value={formData.returnRate}
                    onChange={(e) => setFormData({ ...formData, returnRate: Number(e.target.value) })}
                    min="1"
                    max="30"
                    step="0.5"
                    className="w-full mt-2 accent-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-body mb-1.5">
                    Investment Period (Years)
                  </label>
                  <input
                    type="number"
                    value={formData.years}
                    onChange={(e) => setFormData({ ...formData, years: Number(e.target.value) })}
                    min="1"
                    max="40"
                    className="w-full px-4 py-2.5 border border-slate-border rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm"
                    required
                  />
                  <input
                    type="range"
                    value={formData.years}
                    onChange={(e) => setFormData({ ...formData, years: Number(e.target.value) })}
                    min="1"
                    max="40"
                    className="w-full mt-2 accent-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><RefreshCw className="animate-spin w-4 h-4" /> Simulating...</>
                  ) : (
                    <><TrendingUp className="w-4 h-4" /> Run Simulation</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">{error}</div>
            )}

            {result ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 animate-slideIn">
                  <div className="card text-center p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Future Value</p>
                    <p className="text-xl font-extrabold text-emerald-700">₹{result.futureValue?.toLocaleString()}</p>
                  </div>
                  <div className="card text-center p-5">
                    <p className="text-xs font-semibold text-slate-muted uppercase tracking-wider mb-1">Invested</p>
                    <p className="text-xl font-extrabold text-slate-heading">₹{result.totalInvested?.toLocaleString()}</p>
                  </div>
                  <div className="card text-center p-5 bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-200">
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Growth</p>
                    <p className="text-xl font-extrabold text-indigo-700">₹{result.totalGrowth?.toLocaleString()}</p>
                  </div>
                </div>

                {/* Growth Chart */}
                <div className="card animate-slideIn">
                  <h2 className="text-lg font-bold text-slate-heading mb-4">Investment Growth</h2>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={result.dataPoints}>
                      <defs>
                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" label={{ value: "Years", position: "bottom" }} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip
                        formatter={(value, name) => [`₹${value.toLocaleString()}`, name === "invested" ? "Amount Invested" : "Portfolio Value"]}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="invested" name="Amount Invested" stroke="#6366f1" strokeWidth={2} fill="url(#colorInvested)" />
                      <Area type="monotone" dataKey="value" name="Portfolio Value" stroke="#14b8a6" strokeWidth={2} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* AI Explanation */}
                {result.explanation && (
                  <div className="card border-teal-200 animate-slideIn">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-heading">AI Insight</h2>
                        <p className="text-xs text-slate-muted">Powered by Gemini AI</p>
                      </div>
                    </div>
                    <p className="text-slate-body leading-relaxed text-sm">{result.explanation}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="card text-center py-20">
                <TrendingUp className="w-16 h-16 text-slate-border mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-heading mb-2">Ready to Simulate</h2>
                <p className="text-slate-muted text-sm max-w-md mx-auto">
                  Configure your investment parameters on the left and click "Run Simulation" to see how your money could grow.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Simulator;
