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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || "Learner"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Track your progress and continue your learning journey
          </p>
        </div>

        {/* Admin Section: Pending Approvals */}
        {user?.role === "admin" && pendingUsers.length > 0 && (
          <div className="mb-12 animate-slideIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Pending Approvals
                </h2>
                <p className="text-gray-500">
                  Action required for {pendingUsers.length} contributor
                  applications
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingUsers.map((pendingUser) => (
                <div
                  key={pendingUser._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">
                          {pendingUser.name}
                        </h3>
                        <a
                          href={`mailto:${pendingUser.email}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                        >
                          ✉️ {pendingUser.email}
                        </a>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                        Pending Review
                      </span>
                    </div>

                    <div className="space-y-4 bg-gray-50 rounded-lg p-4 mb-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                          Role Requested
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">👨‍🏫</span>
                          <span className="font-medium text-gray-900">
                            Contributor
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                            Experience
                          </p>
                          <p className="text-gray-900 font-medium">
                            {pendingUser.contributorDetails?.experience ||
                              "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                            Applied On
                          </p>
                          <p className="text-gray-900 font-medium">
                            {new Date(pendingUser.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                          Motivation
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed italic">
                          "{pendingUser.contributorDetails?.reason || "No reason provided"}"
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleStatusUpdate(pendingUser._id, "active")
                        }
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(pendingUser._id, "rejected")
                        }
                        className="flex-1 bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Completed Lessons */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Completed Lessons
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {progress.length} {/* FIXED: was progress.legth */}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          {/* Progress Percentage */}
          {stats && (
            <>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Overall Progress
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.completionPercentage}%
                    </p>
                  </div>
                  <div className="text-4xl">📊</div>
                </div>
                <div className="mt-4">
                  <ProgressBar
                    percentage={stats.completionPercentage}
                    showLabel={false}
                  />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Lessons
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalLessons}
                    </p>
                  </div>
                  <div className="text-4xl">📚</div>
                </div>
              </div>
            </>
          )}

          {/* Role Badge */}
          <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">
                  Your Role
                </p>
                <p className="text-2xl font-bold mt-2 capitalize">
                  {user?.role || "Learner"}
                </p>
              </div>
              <div className="text-4xl">
                {user?.role === "contributor" ? "👨‍🏫" : "👨‍🎓"}
              </div>
            </div>
          </div>
        </div>

        {/* Recently Completed Lessons */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recently Completed
            </h2>
            <Link
              to="/modules"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Modules →
            </Link>
          </div>

          {progress.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No lessons completed yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start your learning journey today!
              </p>
              <Link to="/modules" className="btn-primary inline-block">
                Browse Modules
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {progress.slice(0, 5).map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {p.lessonId?.title || "Lesson"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Completed {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-success">Completed</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/modules"
            className="card hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎓</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Continue Learning
                </h3>
                <p className="text-gray-600 text-sm">
                  Browse available modules and lessons
                </p>
              </div>
            </div>
          </Link>

          {user?.role === "contributor" && (
            <Link
              to="/create-module"
              className="card hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">➕</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Create Module
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Share your knowledge with others
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Learner Path to Contributor */}
        {user?.role === "learner" && stats && (
          <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 mt-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎯</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Become a Contributor
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete all modules and pass the certification exam to unlock
                  contributor status
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Course Progress</span>
                    <span className="font-medium">
                      {stats.completionPercentage}%
                    </span>
                  </div>
                  <ProgressBar
                    percentage={stats.completionPercentage}
                    showLabel={false}
                  />
                </div>
                {stats.completionPercentage === 100 ? (
                  <Link
                    to="/contributor-exam"
                    className="mt-4 btn-primary inline-block"
                  >
                    Take Contributor Exam →
                  </Link>
                ) : (
                  <p className="mt-4 text-sm text-gray-600">
                    {stats.totalLessons - stats.completedLessons} lessons
                    remaining
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
