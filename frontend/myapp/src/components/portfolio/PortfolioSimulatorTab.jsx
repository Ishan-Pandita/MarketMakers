import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Rocket, Sparkles } from "lucide-react";

function PortfolioSimulatorTab({
  formatCurrency,
  isDark,
  onChange,
  onSubmit,
  result,
  simulationForm,
  simulationLoading,
}) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.15fr]">
      <div className="card">
        <div className="mb-5 flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isDark ? "bg-cyan-400/10 text-cyan-300" : "bg-indigo-50 text-indigo-600"}`}>
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Simulation inputs</h2>
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
              We prefill the starting value from your current portfolio.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {[
            { key: "initialAmount", label: "Starting amount", min: 0, step: 100 },
            { key: "monthlyInvestment", label: "Monthly investment", min: 100, step: 100 },
            { key: "returnRate", label: "Expected annual return (%)", min: 1, step: 0.5 },
            { key: "years", label: "Years", min: 1, step: 1 },
          ].map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-sm font-semibold text-slate-body">{field.label}</label>
              <input
                type="number"
                min={field.min}
                step={field.step}
                value={simulationForm[field.key]}
                onChange={(event) => onChange(field.key, Number(event.target.value))}
                className="input-field"
              />
            </div>
          ))}

          <button type="submit" className="btn-primary w-full py-3 text-sm" disabled={simulationLoading}>
            {simulationLoading ? "Running simulation..." : "Run simulation"}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {result ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Future value", value: formatCurrency(result.futureValue) },
                { label: "Invested", value: formatCurrency(result.totalInvested) },
                { label: "Growth", value: formatCurrency(result.totalGrowth), accent: "text-emerald-500" },
              ].map((card) => (
                <div key={card.label} className="card py-5">
                  <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                    {card.label}
                  </div>
                  <div className={`mt-3 text-2xl font-extrabold ${card.accent || ""}`}>{card.value}</div>
                </div>
              ))}
            </div>

            <div className="card">
              <h2 className="text-xl font-bold">Projected growth</h2>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.dataPoints}>
                    <defs>
                      <linearGradient id="investedArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="valueArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke={isDark ? "#94a3b8" : "#64748b"} />
                    <YAxis tick={{ fontSize: 12 }} stroke={isDark ? "#94a3b8" : "#64748b"} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="invested" stroke="#6366f1" strokeWidth={2.5} fill="url(#investedArea)" />
                    <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2.5} fill="url(#valueArea)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="mb-3 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDark ? "bg-cyan-400/10 text-cyan-300" : "bg-indigo-50 text-indigo-600"}`}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI explanation</h2>
                  <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                    Plain-language context for what the projection means.
                  </p>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>{result.explanation}</p>
            </div>
          </>
        ) : (
          <div className="card text-center">
            <Rocket className={`mx-auto h-12 w-12 ${isDark ? "text-cyan-300" : "text-indigo-600"}`} />
            <h2 className="mt-4 text-2xl font-bold">Run a projection</h2>
            <p className={`mx-auto mt-3 max-w-xl text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>
              Compare how your current portfolio base plus monthly contributions might evolve over the coming years.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioSimulatorTab;
