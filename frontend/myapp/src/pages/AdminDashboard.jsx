// src/pages/AdminDashboard.jsx -- Admin Platform Analytics
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import usePageTitle from "../hooks/usePageTitle";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Shield, Users, GraduationCap, Edit3, Hourglass, BookOpen, CheckCircle, FileText, Award } from "lucide-react";

function AdminDashboard() {
  usePageTitle("Admin Dashboard");
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, pendingRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/pending-contributors"),
        ]);
        setStats(statsRes.data);
        setPending(pendingRes.data);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (userId, status) => {
    try {
      await API.put(`/admin/update-status/${userId}`, { status });
      setPending(pending.filter((u) => u._id !== userId));
      toast.success(`User ${status === "active" ? "approved" : "rejected"} successfully`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;

  return (
    <div className="min-h-[calc(100vh-80px)] pt-8 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 md:p-10 mb-8 shadow-elevated animate-slideIn">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display flex items-center gap-3">
            Admin Dashboard <Shield className="w-8 h-8 md:w-10 md:h-10 text-white/90" />
          </h1>
          <p className="text-white/70 mt-2">Platform analytics and management</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slideIn">
            <StatCard label="Total Users" value={stats.users.total} icon={<Users size={24} />} color="indigo" />
            <StatCard label="Active Learners" value={stats.users.learners} icon={<GraduationCap size={24} />} color="teal" />
            <StatCard label="Contributors" value={stats.users.contributors} icon={<Edit3 size={24} />} color="emerald" />
            <StatCard label="Pending Approvals" value={stats.users.pendingApprovals} icon={<Hourglass size={24} />} color="amber" highlight={stats.users.pendingApprovals > 0} />
            <StatCard label="Total Courses" value={stats.content.totalCourses} icon={<BookOpen size={24} />} color="violet" />
            <StatCard label="Active Courses" value={stats.content.activeCourses} icon={<CheckCircle size={24} />} color="green" />
            <StatCard label="Total Exams" value={stats.content.totalExams} icon={<FileText size={24} />} color="blue" />
            <StatCard label="Lessons Completed" value={stats.content.totalCompletedLessons} icon={<Award size={24} />} color="rose" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Approvals */}
          <div className="card animate-slideIn">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-heading">Pending Approvals</h2>
              {pending.length > 0 && (
                <span className="badge badge-warning">{pending.length} pending</span>
              )}
            </div>
            {pending.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-border rounded-xl">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-border" />
                <p className="text-slate-muted text-sm">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map((user) => (
                  <div key={user._id} className="p-4 bg-surface-subtle rounded-xl border border-slate-border/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-slate-heading">{user.name}</h3>
                        <p className="text-sm text-slate-muted">{user.email}</p>
                      </div>
                      <span className="badge badge-warning text-[10px]">Pending</span>
                    </div>
                    {user.contributorDetails && (
                      <p className="text-xs text-slate-body bg-white/60 p-2 rounded-lg mb-3 border border-slate-border/30">
                        <strong>Experience:</strong> {user.contributorDetails.experience || "N/A"} &bull; <strong>Reason:</strong> {user.contributorDetails.reason || "N/A"}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => handleStatusUpdate(user._id, "active")} className="flex-1 bg-success-light text-success-dark hover:bg-success hover:text-white font-bold py-2 rounded-xl transition-all text-sm">
                        Approve
                      </button>
                      <button onClick={() => handleStatusUpdate(user._id, "rejected")} className="flex-1 border border-danger/30 text-danger hover:bg-danger hover:text-white font-bold py-2 rounded-xl transition-all text-sm">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="card animate-slideIn">
            <h2 className="text-lg font-bold text-slate-heading mb-5">Recent Users</h2>
            {stats?.recentUsers?.length === 0 ? (
              <p className="text-slate-muted text-sm text-center py-10">No users yet</p>
            ) : (
              <div className="space-y-2">
                {stats?.recentUsers?.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-surface-subtle rounded-xl hover:bg-indigo-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-heading text-sm">{user.name}</p>
                        <p className="text-xs text-slate-muted">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge text-[10px] ${
                        user.role === "admin" ? "bg-violet-50 text-violet-600 border-violet-200" :
                        user.role === "contributor" ? "badge-info" :
                        "bg-surface-subtle text-slate-muted border-slate-border"
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-[10px] text-slate-muted mt-1">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideIn">
          <Link to="/courses" className="card group hover:border-indigo-200 text-center py-6">
            <BookOpen className="w-8 h-8 mx-auto mb-3 text-slate-muted group-hover:text-indigo-500 transition-colors" />
            <p className="font-bold text-slate-heading group-hover:text-indigo-500 transition-colors">Manage Courses</p>
          </Link>
          <Link to="/exams" className="card group hover:border-teal-200 text-center py-6">
            <FileText className="w-8 h-8 mx-auto mb-3 text-slate-muted group-hover:text-teal-500 transition-colors" />
            <p className="font-bold text-slate-heading group-hover:text-teal-500 transition-colors">Manage Exams</p>
          </Link>
          <Link to="/community" className="card group hover:border-violet-200 text-center py-6">
            <Users className="w-8 h-8 mx-auto mb-3 text-slate-muted group-hover:text-violet-500 transition-colors" />
            <p className="font-bold text-slate-heading group-hover:text-violet-500 transition-colors">View Community</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, highlight }) {
  return (
    <div className={`card text-center p-6 ${highlight ? `border-amber-300 bg-amber-50/30` : ""}`}>
      <div className={`text-${color}-500 mb-3 flex justify-center`}>{icon}</div>
      <div className="text-3xl font-extrabold text-slate-heading mb-1">{value}</div>
      <div className="text-xs font-semibold text-slate-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default AdminDashboard;
