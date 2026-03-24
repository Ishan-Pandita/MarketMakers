import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, BarChart3, PieChart as PieChartIcon, Sparkles } from "lucide-react";

const COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

function PortfolioOverviewTab({
  analysis,
  analyzing,
  healthScore,
  historyData,
  isDark,
  onAnalyze,
  pieData,
  topAssets,
  formatCurrency,
}) {
  const formatSignedCurrency = (value = 0) =>
    `${Number(value || 0) >= 0 ? "+" : "-"}${formatCurrency(Math.abs(Number(value || 0)))}`;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
      <div className="space-y-6">
        <div className="card">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Allocation snapshot</h2>
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                Asset mix based on live market value when pricing is available.
              </p>
            </div>
            <PieChartIcon className={isDark ? "text-cyan-300" : "text-indigo-600"} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={62} outerRadius={96} paddingAngle={3}>
                    {pieData.map((item, index) => (
                      <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {pieData.map((item, index) => (
                <div
                  key={item.name}
                  className={`rounded-2xl border px-4 py-3 ${
                    isDark ? "border-dark-border/30 bg-dark-elevated" : "border-slate-border/60 bg-surface-subtle"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-sm font-semibold capitalize">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{item.percentage}%</span>
                  </div>
                  <div className={`mt-2 text-xs ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                    {formatCurrency(item.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Growth history</h2>
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                Daily snapshots use your saved portfolio totals over time.
              </p>
            </div>
            <Activity className={isDark ? "text-cyan-300" : "text-indigo-600"} />
          </div>

          {historyData.length > 1 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="portfolioHistory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke={isDark ? "#94a3b8" : "#64748b"} />
                  <YAxis tick={{ fontSize: 12 }} stroke={isDark ? "#94a3b8" : "#64748b"} tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fill="url(#portfolioHistory)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={`rounded-3xl border border-dashed p-10 text-center ${isDark ? "border-dark-border/30" : "border-slate-border/60"}`}>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                Update or add assets on different days to build a richer growth chart.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="card">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">AI analysis</h2>
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                Educational guidance from the assistant, grounded in your portfolio.
              </p>
            </div>
            <button type="button" onClick={onAnalyze} disabled={analyzing} className="btn-primary px-4 py-2.5 text-sm">
              {analyzing ? "Analyzing..." : "Run analysis"}
            </button>
          </div>

          {analysis ? (
            <div className="space-y-4">
              <div className={`rounded-2xl border px-4 py-4 ${isDark ? "border-dark-border/30 bg-dark-elevated" : "border-slate-border/60 bg-surface-subtle"}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold">Risk level</span>
                  <span className="badge badge-info">{analysis.riskLevel || healthScore?.riskLevel || "N/A"}</span>
                </div>
                {analysis.summary && <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>{analysis.summary}</p>}
              </div>

              {analysis.insights?.length > 0 && analysis.insights.map((item) => (
                <div key={item} className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? "border-dark-border/30 bg-dark-elevated text-gray-300" : "border-slate-border/60 bg-surface-subtle text-slate-body"}`}>
                  {item}
                </div>
              ))}

              {analysis.suggestions?.length > 0 && analysis.suggestions.map((item) => (
                <div key={item} className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-100" : "border-indigo-100 bg-indigo-50 text-slate-body"}`}>
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <div className={`rounded-3xl border border-dashed p-8 text-center ${isDark ? "border-dark-border/30" : "border-slate-border/60"}`}>
              <Sparkles className={`mx-auto h-10 w-10 ${isDark ? "text-cyan-300" : "text-indigo-600"}`} />
              <p className={`mt-4 text-sm ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                Run analysis to surface diversification notes, concentration risk, and educational next steps.
              </p>
            </div>
          )}
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Top holdings</h2>
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                Ranked by live current value when pricing is available.
              </p>
            </div>
            <BarChart3 className={isDark ? "text-cyan-300" : "text-indigo-600"} />
          </div>

          <div className="space-y-3">
            {topAssets.map((asset, index) => (
              <div key={asset._id || asset.ticker || asset.name} className={`rounded-2xl border px-4 py-3 ${isDark ? "border-dark-border/30 bg-dark-elevated" : "border-slate-border/60 bg-surface-subtle"}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-bold ${isDark ? "bg-dark-surface text-cyan-300" : "bg-white text-indigo-700"}`}>
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold">{asset.name}</div>
                      <div className={`text-xs ${isDark ? "text-gray-500" : "text-slate-muted"}`}>{asset.ticker || asset.assetType}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">
                      {asset.currentValue === null
                        ? "Awaiting live quote"
                        : formatCurrency(asset.currentValue || 0)}
                    </div>
                    <div
                      className={`text-xs ${
                        asset.gainLossAmt === null
                          ? isDark
                            ? "text-gray-500"
                            : "text-slate-muted"
                          : asset.gainLossAmt >= 0
                            ? "text-emerald-500"
                            : "text-red-500"
                      }`}
                    >
                      {asset.gainLossAmt === null
                        ? asset.hasPurchasePrice
                          ? "Waiting for quote"
                          : "Add buy price for P&L"
                        : `${formatSignedCurrency(asset.gainLossAmt || 0)} (${asset.gainLossPct || 0}%)`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioOverviewTab;
