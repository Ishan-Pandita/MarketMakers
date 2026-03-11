// src/pages/Login.jsx - UPGRADED VERSION
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000"></div>

      <div className="max-w-md w-full relative z-10 transition-all duration-700 animate-slideIn">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background-elevated/40 backdrop-blur-md border border-white/10 text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
            Secure Login
          </span>
          <h2 className="text-5xl font-black text-white tracking-tight mb-2">Sign <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-500">In.</span></h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Provide credentials to access your account</p>
        </div>

        <div className="glass-dark p-10 rounded-[32px] border-white/5 shadow-[0_0_80px_#000000] relative group">
          <div className="absolute -top-[1px] -left-[1px] w-12 h-12 border-t-2 border-l-2 border-neon-green rounded-tl-[32px] opacity-20 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute -bottom-[1px] -right-[1px] w-12 h-12 border-b-2 border-r-2 border-neon-purple rounded-br-[32px] opacity-20 group-hover:opacity-100 transition-all duration-500"></div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <ErrorMessage message={error} onClose={() => setError("")} />
            )}

            {/* Email */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-green/50 transition-all font-bold tracking-tight"
                placeholder="operator@marketmakers.id"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] text-neon-purple hover:text-white font-black transition-colors uppercase tracking-widest"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-bold tracking-tight"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer group select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-background-dark text-neon-green focus:ring-neon-green/50 focus:ring-offset-background-dark transition-colors"
                />
                <span className="ml-3 text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">Remember Me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-green text-black py-5 rounded-2xl text-xs font-black tracking-[0.3em] uppercase shadow-[0_0_25px_#00ff664d] hover:shadow-[0_0_40px_#00ff6699] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  <span>Logging In...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-10 text-center border-t border-white/5 pt-8">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-neon-green font-black hover:text-white transition-colors ml-2"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
