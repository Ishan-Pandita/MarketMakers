// src/pages/Login.jsx -- Dual Theme
import usePageTitle from "../hooks/usePageTitle";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ErrorMessage from "../components/ErrorMessage";

function Login() {
  usePageTitle("Log In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (result.success) { navigate("/dashboard"); } else { setError(result.message); }
  };

  return (
    <div className={`min-h-screen flex relative overflow-hidden ${isDark ? 'bg-dark-bg' : 'bg-surface'}`}>
      {/* Left Panel -- Decorative */}
      <div className={`hidden lg:flex lg:w-[55%] bg-gradient-to-br relative items-center justify-center p-16 ${
        isDark ? 'from-cyan-600 via-cyan-700 to-violet-700' : 'from-indigo-500 via-indigo-600 to-teal-500'
      }`}>
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

      {/* Right Panel -- Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-md w-full animate-slideIn">
          <div className="mb-8">
            <h2 className={`text-3xl font-extrabold tracking-tight mb-2 font-display ${isDark ? 'text-gray-100' : 'text-slate-heading'}`}>Sign In</h2>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>Enter your credentials to access your account</p>
          </div>

          <div className={`p-8 rounded-2xl border shadow-card ${
            isDark ? 'bg-dark-card border-dark-border/30 shadow-dark-card' : 'bg-white border-slate-border/60'
          }`}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <ErrorMessage message={error} />}

              <div className="space-y-1.5">
                <label className={`block text-xs font-semibold ml-0.5 ${isDark ? 'text-gray-400' : 'text-slate-body'}`}>Email Address</label>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="input-field" placeholder="you@example.com" disabled={loading} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-0.5">
                  <label className={`block text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-slate-body'}`}>Password</label>
                  <Link to="/forgot-password" className={`text-xs font-semibold transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-500 hover:text-indigo-700'}`}>
                    Forgot Password?
                  </Link>
                </div>
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="input-field" placeholder="********" disabled={loading} />
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer group select-none">
                  <input type="checkbox" className={`w-4 h-4 rounded ${isDark ? 'border-dark-border text-cyan-400 focus:ring-cyan-400/30' : 'border-slate-border text-indigo-500 focus:ring-indigo-500/30'}`} />
                  <span className={`ml-2.5 text-sm font-medium transition-colors ${isDark ? 'text-gray-500 group-hover:text-gray-300' : 'text-slate-muted group-hover:text-slate-body'}`}>Remember me</span>
                </label>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm">
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : "Sign In"}
              </button>
            </form>

            <div className={`mt-6 text-center border-t pt-6 ${isDark ? 'border-dark-border/30' : 'border-slate-border/40'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>
                Don't have an account?{" "}
                <Link to="/register" className={`font-bold transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-500 hover:text-indigo-700'}`}>
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
