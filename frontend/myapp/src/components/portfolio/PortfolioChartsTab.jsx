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

const COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

function PortfolioChartsTab({ historyData, isDark, pieData, formatCurrency }) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="card">
        <h2 className="text-xl font-bold">Allocation chart</h2>
        <p className={`mt-2 text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
          Live market-value allocation when pricing is available.
        </p>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={70} outerRadius={115} paddingAngle={3}>
                {pieData.map((item, index) => (
                  <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold">Portfolio history</h2>
        <p className={`mt-2 text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
          Historical snapshots reflect saved portfolio totals by day.
        </p>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="portfolioHistoryLarge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke={isDark ? "#94a3b8" : "#64748b"} />
              <YAxis tick={{ fontSize: 12 }} stroke={isDark ? "#94a3b8" : "#64748b"} tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2.5} fill="url(#portfolioHistoryLarge)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default PortfolioChartsTab;
