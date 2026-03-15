// src/pages/Dashboard.jsx — Light Theme
import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ProgressBar from "../components/ProgressBar";
import { Link } from "react-router-dom";

function Dashboard() {
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState([]);
  const { user } = useAuth();

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;

  return (
    <div className="min-h-[calc(100vh-80px)] pt-8 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-teal-500 rounded-2xl p-8 md:p-10 mb-8 shadow-elevated animate-slideIn">
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
            <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all text-sm whitespace-nowrap">
              Continue Learning →
            </Link>
          </div>
        </div>

        {/* Admin: Pending Approvals */}
        {user?.role === "admin" && pendingUsers.length > 0 && (
          <div className="mb-8 animate-slideIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-warning-light p-2.5 rounded-xl border border-warning/20">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-heading">Pending Approvals</h2>
                <p className="text-slate-muted text-sm">{pendingUsers.length} contributor applications need review</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingUsers.map((pendingUser) => (
                <div key={pendingUser._id} className="card border-warning/20">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-slate-heading">{pendingUser.name}</h3>
                      <a href={`mailto:${pendingUser.email}`} className="text-indigo-500 hover:text-indigo-700 text-sm">{pendingUser.email}</a>
                    </div>
                    <span className="badge badge-warning">Pending</span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleStatusUpdate(pendingUser._id, "active")} className="flex-1 bg-success-light text-success-dark hover:bg-success hover:text-white font-bold py-2.5 rounded-xl transition-all text-sm">Approve</button>
                    <button onClick={() => handleStatusUpdate(pendingUser._id, "rejected")} className="flex-1 border border-danger/30 text-danger hover:bg-danger hover:text-white font-bold py-2.5 rounded-xl transition-all text-sm">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center p-6">
            <div className="text-3xl font-extrabold text-slate-heading mb-1">{stats?.completionPercentage || 0}%</div>
            <div className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Progress</div>
          </div>
          <div className="card text-center p-6">
            <div className="text-3xl font-extrabold text-slate-heading mb-1">{progress.length}</div>
            <div className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Completed</div>
          </div>
          <div className="card text-center p-6">
            <div className="text-3xl font-extrabold text-slate-heading mb-1">{stats?.totalLessons || 0}</div>
            <div className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Total Lessons</div>
          </div>
          <div className="card text-center p-6">
            <div className="text-3xl font-extrabold text-indigo-500 mb-1 capitalize">{user?.role || "Learner"}</div>
            <div className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Account Type</div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-heading">Recent Activity</h2>
              <Link to="/courses" className="text-sm font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">View All →</Link>
            </div>
            {progress.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-border rounded-xl">
                <div className="text-3xl mb-3 opacity-40">📚</div>
                <p className="text-slate-muted text-sm mb-4">No lessons completed yet</p>
                <Link to="/courses" className="btn-primary inline-block text-sm px-6 py-2">Start Learning</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {progress.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-3.5 bg-surface-subtle rounded-xl hover:bg-indigo-50/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-success-light text-success rounded-xl flex items-center justify-center text-sm">✓</div>
                      <div>
                        <p className="font-semibold text-slate-heading text-sm group-hover:text-indigo-500 transition-colors">{p.lessonId?.title || "Lesson"}</p>
                        <p className="text-xs text-slate-muted mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</p>
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
            <Link to="/courses" className="card group hover:border-indigo-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">📚</div>
                <h3 className="font-bold text-slate-heading group-hover:text-indigo-500 transition-colors">Browse Courses</h3>
              </div>
              <p className="text-slate-muted text-sm">Explore the full curriculum.</p>
            </Link>

            <Link to="/exams" className="card group hover:border-teal-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">📝</div>
                <h3 className="font-bold text-slate-heading group-hover:text-teal-500 transition-colors">Take an Exam</h3>
              </div>
              <p className="text-slate-muted text-sm">Earn certifications.</p>
            </Link>

            {user?.role === "contributor" ? (
              <Link to="/create-course" className="card border-2 border-dashed border-indigo-200 bg-indigo-50/50 group hover:bg-indigo-50">
                <h3 className="font-bold text-indigo-600 mb-1 group-hover:scale-[1.02] origin-left transition-transform">+ Create Course</h3>
                <p className="text-slate-muted text-sm">Publish new educational content.</p>
              </Link>
            ) : (
              <Link to="/community" className="card group hover:border-violet-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">👥</div>
                  <h3 className="font-bold text-slate-heading group-hover:text-violet-500 transition-colors">Community</h3>
                </div>
                <p className="text-slate-muted text-sm">Meet our expert contributors.</p>
              </Link>
            )}
          </div>
        </div>

        {/* Contributor's Courses */}
        {user?.role === "contributor" && courses.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-slate-heading mb-5">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course._id} className="card group hover:border-indigo-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-heading group-hover:text-indigo-500 transition-colors">{course.title}</h3>
                    <span className={`badge ${course.isActive ? 'badge-success' : 'bg-surface-subtle text-slate-muted border border-slate-border'}`}>{course.isActive ? 'Active' : 'Draft'}</span>
                  </div>
                  <p className="text-sm text-slate-body line-clamp-2 mb-4">{course.description}</p>
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
