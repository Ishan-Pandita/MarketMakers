// src/pages/Login.jsx — Light Theme
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex relative overflow-hidden">
      {/* Left Panel — Decorative */}
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-indigo-500 via-indigo-600 to-teal-500 relative items-center justify-center p-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/30 rounded-full"></div>
          <div className="absolute bottom-32 right-20 w-48 h-48 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white/25 rounded-full"></div>
        </div>
        <div className="relative z-10 max-w-lg">
          <div className="mb-8">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mb-6">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M18.5 2L6 18h8.5l-1 12L26 14h-8.5l1-12z" fill="white" /></svg>
            </div>
            <span className="text-white/60 text-sm font-semibold tracking-wide">MarketMakers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight font-display">
            Welcome Back,<br />Trader.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Continue your journey to market mastery with expert-curated courses and real-world strategies.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-md w-full animate-slideIn">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-heading tracking-tight mb-2 font-display">Sign In</h2>
            <p className="text-slate-muted text-sm">Enter your credentials to access your account</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-border/60 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <ErrorMessage message={error} />}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-body ml-0.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="input-field"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-0.5">
                  <label className="block text-xs font-semibold text-slate-body">Password</label>
                  <Link to="/forgot-password" className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="input-field"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer group select-none">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-border text-indigo-500 focus:ring-indigo-500/30" />
                  <span className="ml-2.5 text-sm text-slate-muted font-medium group-hover:text-slate-body transition-colors">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center border-t border-slate-border/40 pt-6">
              <p className="text-sm text-slate-muted">
                Don't have an account?{" "}
                <Link to="/register" className="text-indigo-500 font-bold hover:text-indigo-700 transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
