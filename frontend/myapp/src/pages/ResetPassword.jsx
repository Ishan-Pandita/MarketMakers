// src/pages/ResetPassword.jsx — Light Theme
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try { const { data } = await API.post(`/auth/reset-password/${token}`, { newPassword }); setSuccess(data.message); setTimeout(() => navigate("/login"), 2000); } catch (err) { setError(err.response?.data?.message || "Failed to reset password. Token may be invalid or expired."); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-20">
      <div className="max-w-md w-full animate-slideIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-heading tracking-tight mb-2 font-display">New <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">Password</span></h2>
          <p className="text-sm text-slate-muted">Set your new password below</p>
        </div>
        <div className="card p-8">
          {error && <ErrorMessage message={error} />}
          {success && <div className="mb-4"><SuccessMessage message={success} /><p className="text-xs text-center text-slate-muted mt-2">Redirecting to login...</p></div>}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5"><label htmlFor="newPassword" className="block text-xs font-semibold text-slate-body">New Password</label><input id="newPassword" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" placeholder="••••••••" minLength={6} /></div>
              <div className="space-y-1.5"><label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-body">Confirm Password</label><input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="••••••••" minLength={6} /></div>
              <button type="submit" className="btn-primary w-full py-3" disabled={loading}>{loading ? "Updating..." : "Reset Password"}</button>
            </form>
          )}
          <div className="mt-6 text-center border-t border-slate-border/40 pt-5">
            <Link to="/login" className="text-sm font-semibold text-slate-muted hover:text-indigo-500 transition-colors">← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
