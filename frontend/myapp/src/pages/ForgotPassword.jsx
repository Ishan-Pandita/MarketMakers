// src/pages/ForgotPassword.jsx — Light Theme
import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    try { const { data } = await API.post("/auth/forgot-password", { email }); setSuccess(data.message); setEmail(""); } catch (err) { setError(err.response?.data?.message || "Failed to send reset email"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-20">
      <div className="max-w-md w-full animate-slideIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-heading tracking-tight mb-2 font-display">Reset <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">Password</span></h2>
          <p className="text-sm text-slate-muted">Enter your email to receive a recovery link</p>
        </div>

        <div className="card p-8">
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-body">Email Address</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="your@email.com" />
            </div>
            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button>
          </form>
          <div className="mt-6 text-center border-t border-slate-border/40 pt-5">
            <Link to="/login" className="text-sm font-semibold text-slate-muted hover:text-indigo-500 transition-colors">← Back to Login</Link>
          </div>
          <div className="mt-4 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
            <p className="text-xs text-indigo-500 font-semibold mb-1">ℹ️ Note</p>
            <p className="text-xs text-slate-body leading-relaxed">If email service is not configured, the reset link will be logged to the server console.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
