import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, BarChart3, BookOpen, Bot, Bookmark, Briefcase, Check, Plus } from "lucide-react";

import LoadingSpinner from "../components/LoadingSpinner";
import usePageTitle from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api";

function Dashboard() {
  usePageTitle("Dashboard");
  const navigate = useNavigate();
  const { user, appContext } = useAuth();
  const { isDark } = useTheme();
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [quickQuestion, setQuickQuestion] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        const requests = [
          API.get("/progress/me"),
          API.get("/progress/stats"),
          API.get("/courses/recommended"),
        ];

        if (user?.role === "admin") {
          requests.push(API.get("/admin/pending-contributors"));
        }

        if (user?.role === "contributor" || user?.role === "admin") {
          requests.push(API.get(`/courses?instructor=${user.id}`));
        }

        const results = await Promise.allSettled(requests);
        setProgress(results[0].status === "fulfilled" ? results[0].value.data : []);
        setStats(results[1].status === "fulfilled" ? results[1].value.data : null);
        setRecommendedCourses(
          results[2].status === "fulfilled" ? results[2].value.data?.courses || [] : []
        );

        let offset = 3;
        if (user?.role === "admin") {
          setPendingUsers(
            results[offset]?.status === "fulfilled" ? results[offset].value.data : []
          );
          offset += 1;
        }

        if (user?.role === "contributor" || user?.role === "admin") {
          setCourses(
            results[offset]?.status === "fulfilled" ? results[offset].value.data : []
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id, user?.role]);

  const handleQuickAsk = (event, defaultQuestion) => {
    event?.preventDefault();
    const nextQuestion = (defaultQuestion || quickQuestion).trim();

    if (!nextQuestion) {
      return;
    }

    navigate("/chatbot", {
      state: { prefillMessage: nextQuestion, autoSend: true },
    });
    setQuickQuestion("");
  };

  const handleStatusUpdate = async (userId, status) => {
    try {
      await API.put(`/admin/update-status/${userId}`, { status });
      setPendingUsers((currentUsers) => currentUsers.filter((item) => item._id !== userId));
      toast.success(`Contributor ${status === "active" ? "approved" : "rejected"}.`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update contributor status.");
    }
  };

  if (loading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${isDark ? "bg-dark-bg" : "bg-surface"}`}>
        <LoadingSpinner />
      </div>
    );
  }

  const quickCards = [
    {
      title: "Add an asset",
      body: "Open the portfolio workspace with the asset form ready.",
      icon: Plus,
      action: () => navigate("/portfolio", { state: { openAssetForm: true } }),
    },
    {
      title: "Watchlist",
      body: "Track ideas before you commit them to your portfolio.",
      icon: Bookmark,
      action: () => navigate("/watchlist"),
    },
    {
      title: "News pulse",
      body: "Ask the assistant what matters in markets today.",
      icon: Bot,
      action: (event) =>
        handleQuickAsk(event, "What's in the news today and what should I pay attention to?"),
    },
    {
      title: "Continue learning",
      body: "Jump back into your recommended lessons and courses.",
      icon: BookOpen,
      action: () => navigate("/courses"),
    },
  ];

  return (
    <div className={`min-h-[calc(100vh-80px)] pb-20 pt-8 ${isDark ? "bg-dark-bg" : "bg-surface"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`overflow-hidden rounded-[2rem] border p-6 shadow-elevated sm:p-8 ${
            isDark
              ? "border-dark-border/30 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(167,139,250,0.16),_transparent_30%),#111522]"
              : "border-slate-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.12),_transparent_30%),white]"
          }`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="badge badge-info mb-4">Mission control</span>
              <h1 className="text-3xl font-extrabold tracking-tight font-display sm:text-4xl">
                Welcome back, {user?.name || "Learner"}.
              </h1>
              <p className={`mt-3 text-sm leading-relaxed sm:text-base ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                Portfolio signals, learning progress, and the assistant now share the same context,
                so this dashboard can finally act like a real launchpad.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Portfolio", value: appContext?.portfolio?.assetCount || 0 },
                { label: "Watchlist", value: appContext?.watchlist?.count || 0 },
                { label: "Lessons", value: stats?.completedLessons || progress.length || 0 },
                {
                  label: "Risk profile",
                  value: user?.riskProfile ? user.riskProfile : "new",
                  isLabel: true,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl border px-4 py-4 ${
                    isDark ? "border-dark-border/30 bg-dark-card/80" : "border-white/80 bg-white/80"
                  }`}
                >
                  <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                    {item.label}
                  </div>
                  <div className={`mt-2 text-xl font-extrabold capitalize ${item.isLabel ? (isDark ? "text-cyan-300" : "text-indigo-700") : ""}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleQuickAsk}
            className={`mt-8 flex flex-col gap-3 rounded-[1.5rem] border p-4 sm:flex-row sm:items-center ${
              isDark ? "border-dark-border/30 bg-dark-card/70" : "border-slate-border/60 bg-white/80"
            }`}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? "bg-cyan-400/10 text-cyan-300" : "bg-indigo-50 text-indigo-600"}`}>
              <Bot className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={quickQuestion}
              onChange={(event) => setQuickQuestion(event.target.value)}
              placeholder="Ask anything about your portfolio, a financial concept, or a news headline..."
              className="input-field flex-1 border-0 bg-transparent px-0 py-0 shadow-none focus:ring-0"
            />
            <button type="submit" className="btn-primary whitespace-nowrap px-5 py-3 text-sm">
              Ask the assistant
            </button>
          </form>
        </div>

        {user?.role === "admin" && pendingUsers.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isDark ? "bg-yellow-400/10 text-yellow-300" : "bg-warning-light text-warning-dark"}`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Pending contributor reviews</h2>
                <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                  These accounts are waiting on an admin decision.
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {pendingUsers.map((pendingUser) => (
                <div key={pendingUser._id} className="card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{pendingUser.name}</h3>
                      <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                        {pendingUser.email}
                      </p>
                    </div>
                    <span className="badge badge-warning">Pending</span>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate(pendingUser._id, "active")}
                      className="btn-primary flex-1 py-2.5 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(pendingUser._id, "rejected")}
                      className="btn-outline flex-1 py-2.5 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickCards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={card.action}
              className={`card group text-left ${
                isDark ? "hover:border-cyan-400/20" : "hover:border-indigo-200"
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? "bg-dark-elevated text-cyan-300" : "bg-indigo-50 text-indigo-600"}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                {card.body}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="card">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Recent activity</h2>
                <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                  Your latest completed lessons and milestones.
                </p>
              </div>
              <Link to="/courses" className={`text-sm font-semibold ${isDark ? "text-cyan-300" : "text-indigo-600"}`}>
                View courses
              </Link>
            </div>

            {progress.length === 0 ? (
              <div className={`rounded-3xl border border-dashed p-8 text-center ${isDark ? "border-dark-border/30" : "border-slate-border/60"}`}>
                <BookOpen className={`mx-auto h-10 w-10 ${isDark ? "text-gray-500" : "text-slate-muted"}`} />
                <p className={`mt-4 text-sm ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                  Start a course to populate your activity feed and improve recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {progress.slice(0, 6).map((item) => (
                  <div
                    key={item._id}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                      isDark ? "bg-dark-elevated" : "bg-surface-subtle"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDark ? "bg-emerald-400/10 text-emerald-400" : "bg-success-light text-success-dark"}`}>
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {item.lessonId?.title || "Completed lesson"}
                        </p>
                        <p className={`text-xs ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="badge badge-success text-[10px]">Done</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="mb-5 flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isDark ? "bg-cyan-400/10 text-cyan-300" : "bg-indigo-50 text-indigo-600"}`}>
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Workspace snapshot</h2>
                <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                  A fast read on what the platform already knows about you.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Portfolio value",
                  value: `$${Number(appContext?.portfolio?.totalValue || 0).toLocaleString()}`,
                },
                {
                  label: "Top assets",
                  value:
                    appContext?.portfolio?.topAssets?.length > 0
                      ? appContext.portfolio.topAssets.join(", ")
                      : "No assets yet",
                },
                {
                  label: "Courses in progress",
                  value: appContext?.learning?.coursesInProgress || 0,
                },
                {
                  label: "Watchlist symbols",
                  value:
                    appContext?.watchlist?.symbols?.length > 0
                      ? appContext.watchlist.symbols.join(", ")
                      : "No watchlist items",
                },
              ].map((item) => (
                <div key={item.label} className={`rounded-2xl border px-4 py-3 ${isDark ? "border-dark-border/30 bg-dark-elevated" : "border-slate-border/60 bg-surface-subtle"}`}>
                  <div className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                    {item.label}
                  </div>
                  <div className="mt-2 text-sm font-semibold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Recommended for you</h2>
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                Personalized using your portfolio, learning progress, and risk profile.
              </p>
            </div>
            <Link to="/courses" className={`inline-flex items-center gap-2 text-sm font-semibold ${isDark ? "text-cyan-300" : "text-indigo-600"}`}>
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recommendedCourses.length === 0 ? (
            <div className="card">
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                Add a few assets or complete some lessons and the recommendation engine will become much more specific.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              {recommendedCourses.map((course) => (
                <Link
                  key={course._id}
                  to={`/course/${course._id}/modules`}
                  className={`card group ${
                    isDark ? "hover:border-cyan-400/20" : "hover:border-indigo-200"
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? "bg-dark-elevated text-cyan-300" : "bg-indigo-50 text-indigo-600"}`}>
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{course.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                    {course.description}
                  </p>
                  {course.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            isDark ? "bg-cyan-400/10 text-cyan-300" : "bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {(user?.role === "contributor" || user?.role === "admin") && courses.length > 0 && (
          <div className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Your courses</h2>
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                Manage the content you already publish into the learning system.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <div key={course._id} className="card">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <span className={course.isActive ? "badge badge-success" : "badge badge-info"}>
                      {course.isActive ? "Active" : "Draft"}
                    </span>
                  </div>
                  <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                    {course.description}
                  </p>
                  <Link to={`/course/${course._id}/modules`} className="btn-outline mt-5 inline-flex items-center gap-2 px-4 py-2.5 text-sm">
                    Manage modules <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
