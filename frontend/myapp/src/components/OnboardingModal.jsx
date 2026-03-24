import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BarChart3, Brain, CheckCircle2, ChevronRight, Compass, Sparkles } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AssetSearch from "./AssetSearch";

const RISK_OPTIONS = [
  {
    value: "beginner",
    title: "Beginner",
    description: "I want simple explanations, safer starting points, and guided learning.",
  },
  {
    value: "intermediate",
    title: "Intermediate",
    description: "I know the basics and want portfolio context plus stronger market understanding.",
  },
  {
    value: "advanced",
    title: "Advanced",
    description: "I want sharper language, faster pacing, and strategy-oriented analysis.",
  },
];

const SUGGESTED_ASSETS = [
  { name: "HDFC Bank", ticker: "HDFCBANK", quoteSymbol: "HDFCBANK:NSE", exchange: "NSE", assetType: "stock" },
  { name: "Reliance Industries", ticker: "RELIANCE", quoteSymbol: "RELIANCE:NSE", exchange: "NSE", assetType: "stock" },
  { name: "Nifty 50 ETF", ticker: "NIFTYBEES", quoteSymbol: "NIFTYBEES:NSE", exchange: "NSE", assetType: "etf" },
];

const QUIZ = [
  {
    question: "Why do investors diversify a portfolio?",
    options: [
      "To spread risk across different assets",
      "To guarantee profits",
      "To avoid paying taxes",
    ],
    correctIndex: 0,
  },
  {
    question: "What usually happens when interest rates rise sharply?",
    options: [
      "Borrowing often gets more expensive",
      "Stocks always go up",
      "Inflation becomes impossible",
    ],
    correctIndex: 0,
  },
  {
    question: "An ETF is best described as:",
    options: [
      "A fund traded on an exchange",
      "A private loan contract",
      "A guaranteed-return savings plan",
    ],
    correctIndex: 0,
  },
  {
    question: "What does compound growth mean?",
    options: [
      "Returns can earn returns over time",
      "Losses disappear after one year",
      "Only bonds can grow steadily",
    ],
    correctIndex: 0,
  },
  {
    question: "Which metric is most useful for spotting concentration risk?",
    options: [
      "How much of the portfolio sits in one asset or sector",
      "The app theme setting",
      "The number of news articles you read",
    ],
    correctIndex: 0,
  },
];

function OnboardingModal() {
  const { user, completeOnboarding } = useAuth();
  const { isDark } = useTheme();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [riskProfile, setRiskProfile] = useState(user?.riskProfile || "beginner");
  const [firstAsset, setFirstAsset] = useState({
    name: "",
    ticker: "",
    quoteSymbol: "",
    exchange: "",
    currency: "",
    assetType: "stock",
    amount: "1000",
    purchasePrice: "",
  });
  const [answers, setAnswers] = useState({});
  const answeredCount = Object.keys(answers).length;

  const literacyScore = useMemo(() => {
    const correctAnswers = QUIZ.reduce(
      (count, item, index) => count + (answers[index] === item.correctIndex ? 1 : 0),
      0
    );

    return Math.round((correctAnswers / QUIZ.length) * 100);
  }, [answers]);

  const handleContinue = () => {
    if (step === 0 && !riskProfile) {
      toast.error("Choose the profile that fits you best.");
      return;
    }

    if (step === 2 && answeredCount !== QUIZ.length) {
      toast.error("Answer all five questions so we can tailor the experience.");
      return;
    }

    setStep((currentStep) => Math.min(currentStep + 1, 2));
  };

  const handleSubmit = async () => {
    if (answeredCount !== QUIZ.length) {
      toast.error("Answer all five questions so we can finish setup.");
      return;
    }

    setSubmitting(true);

    try {
      await completeOnboarding({
        riskProfile,
        literacyScore,
        firstAsset:
          firstAsset.name && Number(firstAsset.amount) > 0
            ? {
                ...firstAsset,
                amount: Number(firstAsset.amount),
                purchasePrice:
                  firstAsset.purchasePrice === ""
                    ? undefined
                    : Number(firstAsset.purchasePrice),
              }
            : undefined,
      });
      toast.success("Your workspace is ready.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "We couldn't finish onboarding right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
      <div className="relative flex min-h-screen items-start justify-center overflow-y-auto p-4 sm:p-6">
        <div
          className={`relative my-4 h-[calc(100vh-2rem)] w-full max-w-5xl overflow-hidden rounded-[2rem] border shadow-2xl sm:my-6 sm:h-[min(860px,calc(100vh-3rem))] ${
            isDark
              ? "border-dark-border/40 bg-dark-surface text-gray-100"
              : "border-slate-border/60 bg-white text-slate-heading"
          }`}
        >
          <div
            className={`absolute inset-x-0 top-0 h-40 ${
              isDark
                ? "bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(167,139,250,0.18),_transparent_40%)]"
                : "bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.14),_transparent_40%)]"
            }`}
          />

          <div className="relative grid h-full gap-0 lg:grid-cols-[1.05fr_1.25fr]">
            <div
              className={`h-full overflow-y-auto p-6 sm:p-8 lg:p-10 ${
                isDark
                  ? "border-b border-dark-border/30 lg:border-b-0 lg:border-r"
                  : "border-b border-slate-border/60 lg:border-b-0 lg:border-r"
              }`}
            >
              <span className="badge badge-info mb-4">First-time setup</span>
              <h2 className="text-3xl font-extrabold tracking-tight font-display">
                Shape your MarketMakers workspace.
              </h2>
              <p
                className={`mt-3 max-w-md text-sm leading-relaxed ${
                  isDark ? "text-gray-400" : "text-slate-body"
                }`}
              >
                We’ll tune the assistant, recommendations, and dashboard around how you
                learn and what you’re watching in the market.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  { icon: Compass, title: "Risk profile", body: "Controls how the assistant explains concepts." },
                  { icon: BarChart3, title: "First asset", body: "Optional, but useful for portfolio-aware guidance." },
                  { icon: Brain, title: "Literacy quiz", body: "Helps order the right courses and examples." },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className={`rounded-2xl border px-4 py-4 transition-all ${
                      step === index
                        ? isDark
                          ? "border-cyan-400/30 bg-cyan-400/10"
                          : "border-indigo-200 bg-indigo-50"
                        : isDark
                        ? "border-dark-border/30 bg-dark-card/80"
                        : "border-slate-border/60 bg-surface-subtle"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                          step === index
                            ? isDark
                              ? "bg-cyan-400/15 text-cyan-400"
                              : "bg-white text-indigo-600"
                            : isDark
                            ? "bg-dark-elevated text-gray-400"
                            : "bg-white text-slate-muted"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.title}</p>
                        <p
                          className={`mt-1 text-xs leading-relaxed ${
                            isDark ? "text-gray-500" : "text-slate-muted"
                          }`}
                        >
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={`mt-8 rounded-2xl border px-4 py-4 text-sm ${
                  isDark
                    ? "border-violet-400/20 bg-violet-400/10 text-violet-100"
                    : "border-teal-200 bg-teal-50 text-teal-900"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Sparkles className="h-4 w-4" />
                  What changes after this?
                </div>
                <p className="mt-2 leading-relaxed">
                  Your dashboard gets smarter, the chatbot becomes more relevant to your
                  level, and course recommendations stop being generic.
                </p>
              </div>
            </div>

            <div className="flex h-full min-h-0 flex-col p-6 sm:p-8 lg:p-10">
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                {step === 0 && (
                  <div className="animate-slideIn">
                    <p className="badge badge-role mb-4">Step 1 of 3</p>
                    <h3 className="text-2xl font-extrabold font-display">
                      How would you describe your investing experience?
                    </h3>
                    <div className="mt-6 grid gap-4">
                      {RISK_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setRiskProfile(option.value)}
                          className={`rounded-3xl border p-5 text-left transition-all ${
                            riskProfile === option.value
                              ? isDark
                                ? "border-cyan-400/40 bg-cyan-400/10"
                                : "border-indigo-200 bg-indigo-50"
                              : isDark
                              ? "border-dark-border/30 bg-dark-card hover:border-cyan-400/20"
                              : "border-slate-border/60 bg-white hover:border-indigo-200"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-lg font-bold capitalize">{option.title}</p>
                              <p
                                className={`mt-1 text-sm leading-relaxed ${
                                  isDark ? "text-gray-400" : "text-slate-body"
                                }`}
                              >
                                {option.description}
                              </p>
                            </div>
                            <div
                              className={`h-5 w-5 rounded-full border-2 ${
                                riskProfile === option.value
                                  ? isDark
                                    ? "border-cyan-400 bg-cyan-400"
                                    : "border-indigo-500 bg-indigo-500"
                                  : isDark
                                  ? "border-gray-600"
                                  : "border-slate-300"
                              }`}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="animate-slideIn">
                    <p className="badge badge-role mb-4">Step 2 of 3</p>
                    <h3 className="text-2xl font-extrabold font-display">
                      Add one asset to personalize the workspace.
                    </h3>
                    <p
                      className={`mt-2 text-sm ${
                        isDark ? "text-gray-400" : "text-slate-body"
                      }`}
                    >
                      This step is optional. If you add one now, the assistant and
                      recommendations can use it immediately.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {SUGGESTED_ASSETS.map((asset) => (
                        <button
                          key={asset.ticker}
                          type="button"
                          onClick={() =>
                            setFirstAsset((current) => ({
                              ...current,
                              ...asset,
                            }))
                          }
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                            isDark
                              ? "bg-dark-elevated text-cyan-300 hover:bg-cyan-400/10"
                              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                          }`}
                        >
                          {asset.name}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 space-y-4">
                      <AssetSearch
                        currentValue={
                          firstAsset.name
                            ? `${firstAsset.name}${firstAsset.ticker ? ` (${firstAsset.ticker})` : ""}`
                            : ""
                        }
                        onSelect={({ name, ticker, quoteSymbol, exchange, currency, assetType }) =>
                          setFirstAsset((current) => ({
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

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-body">
                            Starting amount
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={firstAsset.amount}
                            onChange={(event) =>
                              setFirstAsset((current) => ({
                                ...current,
                                amount: event.target.value,
                              }))
                            }
                            className="input-field"
                            placeholder="1000"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-body">
                            Purchase price
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={firstAsset.purchasePrice}
                            onChange={(event) =>
                              setFirstAsset((current) => ({
                                ...current,
                                purchasePrice: event.target.value,
                              }))
                            }
                            className="input-field"
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-slideIn">
                    <p className="badge badge-role mb-4">Step 3 of 3</p>
                    <h3 className="text-2xl font-extrabold font-display">
                      Quick literacy check.
                    </h3>
                    <p
                      className={`mt-2 text-sm ${
                        isDark ? "text-gray-400" : "text-slate-body"
                      }`}
                    >
                      This is just for calibration. We use the score to decide how beginner-
                      friendly your dashboard and course suggestions should be.
                    </p>

                    <div className="mt-6 space-y-4 pb-1">
                      {QUIZ.map((item, questionIndex) => (
                        <div
                          key={item.question}
                          className={`rounded-3xl border p-5 ${
                            isDark
                              ? "border-dark-border/30 bg-dark-card"
                              : "border-slate-border/60 bg-surface-subtle"
                          }`}
                        >
                          <p className="text-sm font-bold">{item.question}</p>
                          <div className="mt-4 grid gap-2">
                            {item.options.map((option, optionIndex) => {
                              const selected = answers[questionIndex] === optionIndex;

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  aria-pressed={selected}
                                  onClick={() =>
                                    setAnswers((current) => ({
                                      ...current,
                                      [questionIndex]: optionIndex,
                                    }))
                                  }
                                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition-all ${
                                    selected
                                      ? isDark
                                        ? "border-cyan-300 bg-cyan-400/15 text-cyan-50 ring-2 ring-cyan-300/40"
                                        : "border-indigo-400 bg-indigo-50 text-slate-heading ring-2 ring-indigo-200"
                                      : isDark
                                      ? "border-dark-border/30 bg-dark-elevated text-gray-300 hover:border-cyan-400/20 hover:bg-cyan-400/5"
                                      : "border-slate-border bg-white text-slate-body hover:border-indigo-200 hover:bg-indigo-50/60"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <span>{option}</span>
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                                        selected
                                          ? isDark
                                            ? "bg-cyan-300/15 text-cyan-100"
                                            : "bg-white text-indigo-700"
                                          : "opacity-0"
                                      }`}
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      Selected
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div
                className={`mt-6 shrink-0 border-t pt-6 ${
                  isDark ? "border-dark-border/30" : "border-slate-border/60"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div
                    className={`text-sm ${
                      isDark ? "text-gray-500" : "text-slate-muted"
                    }`}
                  >
                    {step === 2
                      ? `${answeredCount}/${QUIZ.length} answered. Estimated literacy score: ${literacyScore}/100`
                      : "You can always update your profile and portfolio later."}
                  </div>

                  <div className="flex gap-3">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((currentStep) => Math.max(currentStep - 1, 0))}
                      className="btn-outline px-5 py-2.5 text-sm"
                    >
                      Back
                    </button>
                  )}

                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
                    >
                      Continue <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleSubmit}
                      className="btn-primary px-5 py-2.5 text-sm"
                    >
                      {submitting ? "Finishing setup..." : "Complete onboarding"}
                    </button>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingModal;
