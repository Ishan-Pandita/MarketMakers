// src/pages/Dashboard.jsx - UPGRADED VERSION (ALL BUGS FIXED)
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch progress
      const progressRes = await API.get("/progress/me");
      setProgress(progressRes.data);

      // Fetch stats (if endpoint exists)
      try {
        const statsRes = await API.get("/progress/stats");
        setStats(statsRes.data);
      } catch (err) {
        console.log("Stats endpoint not available");
      }

      // Fetch pending contributors if admin
      if (user?.role === "admin") {
        try {
          const pendingRes = await API.get("/admin/pending-contributors");
          setPendingUsers(pendingRes.data);
        } catch (err) {
          console.error("Error fetching pending users:", err);
        }
      }

      // Fetch instructor's courses
      if (user?.role === "contributor" || user?.role === "admin") {
        try {
          const coursesRes = await API.get(`/courses?instructor=${user.id}`);
          setCourses(coursesRes.data);
        } catch (err) {
          console.error("Error fetching instructor courses:", err);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, status) => {
    try {
      await API.put(`/admin/update-status/${userId}`, { status });
      // Remove from list
      setPendingUsers(pendingUsers.filter((u) => u._id !== userId));
      alert(`User ${status} successfully`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neon-green">
        <LoadingSpinner size="large" text="Syncing terminal..." />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] pt-12 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 animate-slideIn">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Welcome back, {user?.name || "Trader"}
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Terminal active. Track your market edge and learning momentum.
          </p>
        </div>

        {/* Admin Section: Pending Approvals */}
        {user?.role === "admin" && pendingUsers.length > 0 && (
          <div className="mb-12 animate-slideIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-500/20 p-3 rounded-full border border-yellow-500/30">
                <span className="text-2xl drop-shadow-[0_0_10px_#eab308cc]">⚠️</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Pending Roles</h2>
                <p className="text-gray-400">Action required for {pendingUsers.length} elite applications</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingUsers.map((pendingUser) => (
                <div key={pendingUser._id} className="card bg-background-elevated border-yellow-500/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-white">{pendingUser.name}</h3>
                      <a href={`mailto:${pendingUser.email}`} className="text-neon-purple hover:text-white text-sm font-medium">
                        {pendingUser.email}
                      </a>
                    </div>
                    <span className="badge badge-warning">Pending Review</span>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => handleStatusUpdate(pendingUser._id, "active")} className="flex-1 bg-neon-green/20 text-neon-green hover:bg-neon-green hover:text-black font-bold py-2.5 rounded-lg transition-all">
                      Approve
                    </button>
                    <button onClick={() => handleStatusUpdate(pendingUser._id, "rejected")} className="flex-1 border border-red-500/50 text-red-400 hover:bg-red-500/20 font-bold py-2.5 rounded-lg transition-all">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bento Grid: Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">

          {/* Main Momentum Card (col-span-8) */}
          <div className="md:col-span-8 card relative overflow-hidden group hover:border-neon-green/50">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-neon-green/5 rounded-full blur-[80px] group-hover:bg-neon-green/10 transition-colors"></div>
            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Portfolio Momentum</p>
                  <h2 className="text-4xl font-black text-white">Learning Edge</h2>
                </div>
                <div className="w-12 h-12 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/30">
                  <span className="text-xl">📈</span>
                </div>
              </div>

              <div className="mt-8 flex items-end gap-6">
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                  {stats ? stats.completionPercentage : 0}<span className="text-4xl text-neon-green">%</span>
                </div>
                <div className="pb-2">
                  <p className="text-gray-400 font-medium">Overall Progress</p>
                </div>
              </div>

              {stats && (
                <div className="mt-6 w-full bg-background-dark rounded-full h-2 mb-4 border border-white/5 overflow-hidden">
                  <div className="bg-neon-green h-2 rounded-full shadow-[0_0_10px_#00ff66cc]" style={{ width: `${stats.completionPercentage}%` }}></div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column Cards (col-span-4) */}
          <div className="md:col-span-4 flex flex-col gap-6">

            <div className="card flex-1 flex flex-col justify-center border-neon-purple/20 bg-gradient-to-br from-background-elevated to-[#1a112c]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neon-purple text-xs font-bold uppercase tracking-widest">Active Status</p>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-purple"></span>
                </span>
              </div>
              <p className="text-3xl font-black text-white capitalize">{user?.role || "Learner"}</p>
              <p className="text-gray-400 mt-1">Level 1 Trader</p>
            </div>

            <div className="card flex-1 flex justify-between items-center bg-background-dark">
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Completed</p>
                <p className="text-3xl font-black text-white">{progress.length} <span className="text-sm font-normal text-gray-500">/ {stats?.totalLessons || 0}</span></p>
              </div>
              <div className="text-4xl drop-shadow-[0_0_15px_#ffffff33]">✓</div>
            </div>

          </div>
        </div>

        {/* Bottom Bento Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Recently Completed (col-span-2) */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">Recent Executions</h2>
              <Link to="/modules" className="text-neon-green hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">
                Terminal →
              </Link>
            </div>

            {progress.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
                <div className="text-4xl mb-4 opacity-50">⚡</div>
                <Link to="/modules" className="btn-primary inline-block mt-4 text-sm px-6 py-2">Start Learning</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {progress.slice(0, 4).map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-4 bg-background-dark rounded-xl border border-white/5 hover:border-neon-green/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-neon-green/10 text-neon-green rounded-full flex items-center justify-center border border-neon-green/20 group-hover:shadow-[0_0_10px_#00ff6666] transition-all">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-gray-200 group-hover:text-white transition-colors">{p.lessonId?.title || "Encrypted Lesson"}</p>
                        <p className="text-xs text-gray-500 font-mono mt-1">{new Date(p.createdAt).toISOString().split('T')[0]}</p>
                      </div>
                    </div>
                    <span className="badge badge-success hidden sm:inline-flex">Verified</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Actions / Path */}
          <div className="flex flex-col gap-6">
            <Link to="/courses" className="card hover:shadow-[0_0_30px_#8b5cf626] hover:border-neon-purple/50 group transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🎓
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-neon-purple transition-colors">
                  {user?.role === "contributor" ? "Course Network" : "Continue Program"}
                </h3>
              </div>
              <p className="text-gray-400 text-sm">Access the global trading education curriculum.</p>
            </Link>

            {user?.role === "contributor" ? (
              <Link to="/create-course" className="card border-2 border-dashed border-neon-green/30 bg-neon-green/5 hover:bg-neon-green/10 hover:border-neon-green/60 transition-all group">
                <h3 className="text-lg font-black text-neon-green mb-2 group-hover:scale-105 origin-left transition-transform">+ Deploy Course</h3>
                <p className="text-gray-400 text-sm text-balance">Create a new smart module for the network.</p>
              </Link>
            ) : (
              stats && (
                <div className="card relative overflow-hidden border-yellow-500/20 bg-gradient-to-br from-background-card to-[#231a0c]">
                  <div className="relative z-10">
                    <h3 className="text-lg font-black text-yellow-500 mb-2">Unlock Contributor</h3>
                    <p className="text-gray-400 text-sm mb-6">Master the curriculum to mint your contributor badge.</p>

                    {stats.completionPercentage === 100 ? (
                      <Link to="/contributor-exam" className="w-full text-center bg-yellow-500 text-black font-black py-3 rounded-lg block hover:bg-yellow-400 shadow-[0_0_15px_#eab30866]">
                        Take Final Exam
                      </Link>
                    ) : (
                      <div className="text-xs font-mono text-gray-500 flex justify-between items-center">
                        <span>REQUIREMENT: 100%</span>
                        <span className="text-yellow-500/80">{stats.totalLessons - stats.completedLessons} remaining</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Contributor's Courses List */}
        {user?.role === "contributor" && courses.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black text-white mb-6">Deployed Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="card group hover:border-neon-green/40">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-white group-hover:text-neon-green transition-colors">{course.title}</h3>
                    <span className={`badge ${course.isActive ? 'badge-success' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {course.isActive ? 'Active' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                    {course.description}
                  </p>
                  <Link to={`/course/${course._id}/modules`} className="block w-full text-center bg-background-dark border border-white/10 hover:border-neon-green/50 text-white font-bold py-2 rounded-lg transition-colors">
                    Configure Modules
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
