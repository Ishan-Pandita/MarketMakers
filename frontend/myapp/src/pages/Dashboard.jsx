// src/pages/Dashboard.jsx — Dual Theme
import usePageTitle from "../hooks/usePageTitle";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ProgressBar from "../components/ProgressBar";
import { Link } from "react-router-dom";
import { AlertTriangle, BarChart3, Bot, Rocket, BookOpen, Check } from "lucide-react";

function Dashboard() {
  usePageTitle("Dashboard");
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState([]);
  const { user } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const progressRes = await API.get("/progress/me");
      setProgress(progressRes.data);
      try { const statsRes = await API.get("/progress/stats"); setStats(statsRes.data); } catch (err) { console.log("Stats endpoint not available"); }
      if (user?.role === "admin") { try { const pendingRes = await API.get("/admin/pending-contributors"); setPendingUsers(pendingRes.data); } catch (err) { console.error("Error fetching pending users:", err); } }
      if (user?.role === "contributor" || user?.role === "admin") { try { const coursesRes = await API.get(`/courses?instructor=${user.id}`); setCourses(coursesRes.data); } catch (err) { console.error("Error fetching instructor courses:", err); } }
    } catch (error) { console.error("Error fetching dashboard data:", error); } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (userId, status) => {
    try { await API.put(`/admin/update-status/${userId}`, { status }); setPendingUsers(pendingUsers.filter((u) => u._id !== userId)); alert(`User ${status} successfully`); } catch (error) { console.error("Error updating status:", error); alert("Failed to update status"); }
  };

  if (loading) return <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-dark-bg' : 'bg-surface'}`}><LoadingSpinner /></div>;

  const quickLinks = [
    { to: "/portfolio/dashboard", Icon: BarChart3, name: "Portfolio Dashboard", desc: "Charts, health score & AI insights.", color: isDark ? 'text-cyan-400 bg-cyan-400/10' : 'text-teal-500 bg-teal-50', hoverBorder: isDark ? 'hover:border-cyan-400/20' : 'hover:border-teal-200' },
    { to: "/chatbot", Icon: Bot, name: "AI Chatbot", desc: "Ask financial questions.", color: isDark ? 'text-violet-400 bg-violet-400/10' : 'text-indigo-500 bg-indigo-50', hoverBorder: isDark ? 'hover:border-violet-400/20' : 'hover:border-indigo-200' },
    { to: "/simulator", Icon: Rocket, name: "Simulator", desc: "Simulate investment growth.", color: isDark ? 'text-emerald-400 bg-emerald-400/10' : 'text-emerald-500 bg-emerald-50', hoverBorder: isDark ? 'hover:border-emerald-400/20' : 'hover:border-emerald-200' },
    { to: "/courses", Icon: BookOpen, name: "Courses", desc: "Learn financial concepts.", color: isDark ? 'text-cyan-400 bg-cyan-400/10' : 'text-violet-500 bg-violet-50', hoverBorder: isDark ? 'hover:border-cyan-400/20' : 'hover:border-violet-200' },
  ];

  return (
    <div className={`min-h-[calc(100vh-80px)] pt-8 pb-20 ${isDark ? 'bg-dark-bg' : 'bg-surface'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className={`bg-gradient-to-r rounded-2xl p-8 md:p-10 mb-8 shadow-elevated animate-slideIn ${
          isDark ? 'from-cyan-600 to-violet-600' : 'from-indigo-500 to-teal-500'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display">
                Welcome back, {user?.name || "Learner"} 👋
              </h1>
              <p className="text-white/70 mt-2 text-base">
                {stats ? `You've completed ${stats.completedLessons || 0} out of ${stats.totalLessons || 0} lessons. Keep going!` : "Track your learning progress and continue your journey."}
              </p>
              {stats && (
                <div className="mt-4 max-w-md">
                  <div className="flex justify-between text-sm text-white/60 mb-1.5">
                    <span>Overall Progress</span>
                    <span className="font-bold text-white">{stats.completionPercentage || 0}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-white h-2.5 rounded-full transition-all duration-700" style={{ width: `${stats.completionPercentage || 0}%` }}></div>
                  </div>
                </div>
              )}
            </div>
            <Link to="/courses" className={`inline-flex items-center gap-2 px-6 py-3 font-bold rounded-xl shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all text-sm whitespace-nowrap ${
              isDark ? 'bg-dark-bg text-cyan-400' : 'bg-white text-indigo-600'
            }`}>
              Continue Learning →
            </Link>
          </div>
        </div>

        {/* Admin: Pending Approvals */}
        {user?.role === "admin" && pendingUsers.length > 0 && (
          <div className="mb-8 animate-slideIn">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-yellow-400/10 border-yellow-400/20' : 'bg-warning-light border-warning/20'}`}>
                <AlertTriangle className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-warning'}`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-slate-heading'}`}>Pending Approvals</h2>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>{pendingUsers.length} contributor applications need review</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingUsers.map((pendingUser) => (
                <div key={pendingUser._id} className={`card ${isDark ? 'border-yellow-400/20' : 'border-warning/20'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-slate-heading'}`}>{pendingUser.name}</h3>
                      <a href={`mailto:${pendingUser.email}`} className={`text-sm ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-500 hover:text-indigo-700'}`}>{pendingUser.email}</a>
                    </div>
                    <span className="badge badge-warning">Pending</span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleStatusUpdate(pendingUser._id, "active")} className={`flex-1 font-bold py-2.5 rounded-xl transition-all text-sm ${isDark ? 'bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20' : 'bg-success-light text-success-dark hover:bg-success hover:text-white'}`}>Approve</button>
                    <button onClick={() => handleStatusUpdate(pendingUser._id, "rejected")} className={`flex-1 border font-bold py-2.5 rounded-xl transition-all text-sm ${isDark ? 'border-red-400/30 text-red-400 hover:bg-red-400/10' : 'border-danger/30 text-danger hover:bg-danger hover:text-white'}`}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: `${stats?.completionPercentage || 0}%`, label: "Progress" },
            { value: progress.length, label: "Completed" },
            { value: stats?.totalLessons || 0, label: "Total Lessons" },
            { value: user?.role || "Learner", label: "Account Type", isRole: true },
          ].map((s, i) => (
            <div key={i} className="card text-center p-6">
              <div className={`text-3xl font-extrabold mb-1 ${s.isRole ? (isDark ? 'text-cyan-400 capitalize' : 'text-indigo-500 capitalize') : (isDark ? 'text-gray-100' : 'text-slate-heading')}`}>
                {s.value}
              </div>
              <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-slate-heading'}`}>Recent Activity</h2>
              <Link to="/courses" className={`text-sm font-semibold transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-500 hover:text-indigo-700'}`}>View All →</Link>
            </div>
            {progress.length === 0 ? (
              <div className={`text-center py-12 border border-dashed rounded-xl ${isDark ? 'border-dark-border' : 'border-slate-border'}`}>
                <BookOpen className={`w-8 h-8 mx-auto mb-3 opacity-40 ${isDark ? 'text-gray-600' : 'text-slate-muted'}`} />
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>No lessons completed yet</p>
                <Link to="/courses" className="btn-primary inline-block text-sm px-6 py-2">Start Learning</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {progress.slice(0, 5).map((p) => (
                  <div key={p._id} className={`flex items-center justify-between p-3.5 rounded-xl transition-colors group ${
                    isDark ? 'bg-dark-elevated/50 hover:bg-dark-elevated' : 'bg-surface-subtle hover:bg-indigo-50/50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-400/10 text-emerald-400' : 'bg-success-light text-success'}`}>
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm transition-colors ${isDark ? 'text-gray-200 group-hover:text-cyan-400' : 'text-slate-heading group-hover:text-indigo-500'}`}>{p.lessonId?.title || "Lesson"}</p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-600' : 'text-slate-muted'}`}>{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="badge badge-success text-[10px] hidden sm:inline-flex">Completed</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-4">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to} className={`card group ${link.hoverBorder}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${link.color}`}>
                    <link.Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`font-bold transition-colors ${isDark ? 'text-gray-200 group-hover:text-cyan-400' : 'text-slate-heading group-hover:text-indigo-500'}`}>{link.name}</h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Contributor's Courses */}
        {user?.role === "contributor" && courses.length > 0 && (
          <div className="mt-10">
            <h2 className={`text-xl font-bold mb-5 ${isDark ? 'text-gray-100' : 'text-slate-heading'}`}>Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course._id} className={`card group ${isDark ? 'hover:border-cyan-400/20' : 'hover:border-indigo-200'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`font-bold transition-colors ${isDark ? 'text-gray-200 group-hover:text-cyan-400' : 'text-slate-heading group-hover:text-indigo-500'}`}>{course.title}</h3>
                    <span className={`badge ${course.isActive ? 'badge-success' : (isDark ? 'bg-dark-elevated text-gray-500 border border-dark-border' : 'bg-surface-subtle text-slate-muted border border-slate-border')}`}>{course.isActive ? 'Active' : 'Draft'}</span>
                  </div>
                  <p className={`text-sm line-clamp-2 mb-4 ${isDark ? 'text-gray-400' : 'text-slate-body'}`}>{course.description}</p>
                  <Link to={`/course/${course._id}/modules`} className="btn-outline w-full text-center text-sm py-2">Manage Modules</Link>
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
