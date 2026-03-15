// src/pages/Profile.jsx — Light Theme
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

function Profile() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => { if (user) setProfileData({ name: user.name || "", email: user.email || "" }); }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    try { const { data } = await API.put("/auth/profile", profileData); const token = localStorage.getItem("token"); login(token, data); setSuccess("Profile updated!"); } catch (err) { setError(err.response?.data?.message || "Failed to update profile"); } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (passwordData.newPassword !== passwordData.confirmPassword) { setError("New passwords do not match"); return; }
    if (passwordData.newPassword.length < 6) { setError("New password must be at least 6 characters"); return; }
    setLoading(true);
    try { await API.put("/auth/change-password", { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }); setSuccess("Password changed!"); setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" }); } catch (err) { setError(err.response?.data?.message || "Failed to change password"); } finally { setLoading(false); }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-surface py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 animate-slideIn">
          <span className="badge badge-info mb-4">Settings</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-heading mb-3 tracking-tight font-display">Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">Settings</span></h1>
          <p className="text-lg text-slate-body">Manage your profile details and security.</p>
        </div>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
        {success && <div className="mb-4"><SuccessMessage message={success} /></div>}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl text-white font-bold shadow-glow-indigo">{user.name?.[0] || "U"}</div>
              <h2 className="text-xl font-bold text-slate-heading mb-1">{user.name}</h2>
              <span className="badge badge-role capitalize mb-4">{user.role}</span>
              <div className="space-y-2 mt-4">
                <div className="bg-surface-subtle p-3 rounded-xl flex items-center justify-between"><span className="text-xs text-slate-muted">Status</span><span className="badge badge-success text-[10px]">Active</span></div>
                <div className="bg-surface-subtle p-3 rounded-xl flex items-center justify-between"><span className="text-xs text-slate-muted">Joined</span><span className="text-xs font-semibold text-slate-heading">{new Date(user.createdAt).toLocaleDateString()}</span></div>
              </div>
            </div>
            {user.role === "learner" && (
              <div className="card p-5 bg-indigo-50/50 border-indigo-100">
                <h3 className="font-bold text-indigo-700 mb-2">Become a Contributor</h3>
                <p className="text-xs text-slate-body mb-3 leading-relaxed">Pass the Contributor Exam to unlock course creation tools.</p>
                <a href="/exams" className="btn-primary w-full text-center text-sm py-2.5 block">Take the Exam</a>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6"><div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">👤</div><h2 className="text-xl font-bold text-slate-heading">Personal Information</h2></div>
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="block text-xs font-semibold text-slate-body ml-0.5">Full Name</label><input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="input-field" required /></div>
                  <div className="space-y-1.5"><label className="block text-xs font-semibold text-slate-body ml-0.5">Email Address</label><input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="input-field" required /></div>
                </div>
                <button type="submit" className="btn-primary text-sm py-3 px-8" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
              </form>
            </div>

            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6"><div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center text-lg">🔐</div><h2 className="text-xl font-bold text-slate-heading">Change Password</h2></div>
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div className="space-y-1.5 max-w-md"><label className="block text-xs font-semibold text-slate-body ml-0.5">Current Password</label><input type="password" placeholder="Current password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="input-field" required /></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="block text-xs font-semibold text-slate-body ml-0.5">New Password</label><input type="password" placeholder="Min 6 characters" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="input-field" required minLength={6} /></div>
                  <div className="space-y-1.5"><label className="block text-xs font-semibold text-slate-body ml-0.5">Confirm New Password</label><input type="password" placeholder="Confirm password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="input-field" required minLength={6} /></div>
                </div>
                <button type="submit" className="btn-secondary text-sm py-3 px-8" disabled={loading}>{loading ? "Updating..." : "Update Password"}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
