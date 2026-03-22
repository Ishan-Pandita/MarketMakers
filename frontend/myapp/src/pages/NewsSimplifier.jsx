// src/pages/NewsSimplifier.jsx — Financial News Simplifier (Feature 6)
import usePageTitle from "../hooks/usePageTitle";
import { useState } from "react";
import API from "../services/api";

function NewsSimplifier() {
  usePageTitle("News Simplifier");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSimplify = async (e) => {
    e.preventDefault();
    if (text.trim().length < 10) {
      setError("Please enter at least 10 characters of financial news.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await API.post("/ai/simplify-news", { text });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to simplify. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exampleTexts = [
    "Federal Reserve increased interest rates by 25 basis points to combat persistent inflation.",
    "The yield curve has inverted, which historically signals a potential recession within 12-18 months.",
    "Tesla stock surged 12% after quarterly earnings beat analyst expectations with record deliveries.",
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] pt-8 pb-20 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 animate-slideIn">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 mb-4">
            <span className="text-3xl">📰</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-heading tracking-tight font-display">
            Financial News Simplifier
          </h1>
          <p className="text-slate-muted mt-2 max-w-xl mx-auto">
            Paste complex financial news and get a simple explanation anyone can understand.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSimplify} className="card mb-8">
          <label className="block text-sm font-semibold text-slate-body mb-2">
            Paste financial news or article excerpt
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Federal Reserve increased interest rates by 25 basis points..."
            rows={5}
            className="w-full px-4 py-3 border border-slate-border rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm resize-none"
          />

          {/* Quick examples */}
          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            <span className="text-xs text-slate-muted font-semibold">Try:</span>
            {exampleTexts.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setText(ex)}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
              >
                Example {i + 1}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || text.trim().length < 10}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="animate-spin">⟳</span> Simplifying...</>
            ) : (
              <>🧠 Simplify This</>
            )}
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-slideIn">
            {/* Summary */}
            <div className="card border-amber-200">
              <h2 className="text-lg font-bold text-slate-heading mb-3 flex items-center gap-2">
                <span>📋</span> Summary
              </h2>
              <p className="text-slate-body leading-relaxed">{result.summary}</p>
            </div>

            {/* Simple Explanation */}
            <div className="card bg-gradient-to-br from-indigo-50/50 to-teal-50/50 border-indigo-200">
              <h2 className="text-lg font-bold text-slate-heading mb-3 flex items-center gap-2">
                <span>💡</span> In Simple Words
              </h2>
              <p className="text-slate-body leading-relaxed">{result.simpleExplanation}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Insights */}
              {result.keyInsights && result.keyInsights.length > 0 && (
                <div className="card">
                  <h2 className="text-lg font-bold text-slate-heading mb-3 flex items-center gap-2">
                    <span>🔑</span> Key Insights
                  </h2>
                  <ul className="space-y-2">
                    {result.keyInsights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-body">
                        <span className="text-indigo-400 mt-0.5 font-bold">{i + 1}.</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Impact */}
              <div className="card">
                <h2 className="text-lg font-bold text-slate-heading mb-3 flex items-center gap-2">
                  <span>📊</span> Market Impact
                </h2>
                <p className="text-slate-body text-sm leading-relaxed">{result.impact}</p>
              </div>
            </div>

            {/* Terms */}
            {result.terms && result.terms.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-slate-heading mb-3 flex items-center gap-2">
                  <span>📖</span> Key Terms Explained
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.terms.map((t, i) => (
                    <div key={i} className="p-3 bg-surface-subtle rounded-xl">
                      <p className="font-bold text-sm text-indigo-600">{t.term}</p>
                      <p className="text-xs text-slate-body mt-1">{t.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsSimplifier;
