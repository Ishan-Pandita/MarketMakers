// src/pages/Register.jsx — Dual Theme
import usePageTitle from "../hooks/usePageTitle";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { GraduationCap, Users } from "lucide-react";

function Register() {
  usePageTitle("Register");
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", role: "learner",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!formData.name.trim()) { setError("Name is required"); return false; }
    if (!formData.email.trim()) { setError("Email is required"); return false; }
    if (!/\S+@\S+\.\S+/.test(formData.email)) { setError("Please enter a valid email"); return false; }
    if (formData.password.length < 6) { setError("Password must be at least 6 characters"); return false; }
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    const result = await register(formData.name, formData.email, formData.password, formData.role, formData.experience, formData.reason);
    setLoading(false);
    if (result.success) {
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className={`min-h-screen flex relative overflow-hidden ${isDark ? 'bg-dark-bg' : 'bg-surface'}`}>
      {/* Left Panel */}
      <div className={`hidden lg:flex lg:w-[50%] bg-gradient-to-br relative items-center justify-center p-16 ${
        isDark ? 'from-cyan-600 via-cyan-700 to-violet-700' : 'from-indigo-600 via-indigo-500 to-teal-500'
      }`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 right-16 w-40 h-40 border border-white/30 rounded-full"></div>
          <div className="absolute bottom-24 left-16 w-32 h-32 border border-white/20 rounded-full"></div>
        </div>
        <div className="relative z-10 max-w-lg">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M18.5 2L6 18h8.5l-1 12L26 14h-8.5l1-12z" fill="white" /></svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight font-display">
            Join the<br />Community.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Create your account and start mastering the markets with expert-curated courses and certifications.
          </p>
          <div className="mt-10 flex gap-8">
            {[{ v: '1,000+', l: 'Learners' }, { v: '50+', l: 'Modules' }, { v: '3', l: 'Courses' }].map(s => (
              <div key={s.l}>
                <div className="text-2xl font-extrabold text-white">{s.v}</div>
                <div className="text-sm text-white/50">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-24 overflow-y-auto">
        <div className="max-w-lg w-full animate-slideIn">
          <div className="mb-8">
            <h2 className={`text-3xl font-extrabold tracking-tight mb-2 font-display ${isDark ? 'text-gray-100' : 'text-slate-heading'}`}>Create Account</h2>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>Fill in your details to get started</p>
          </div>

          <div className={`p-8 rounded-2xl border shadow-card ${isDark ? 'bg-dark-card border-dark-border/30 shadow-dark-card' : 'bg-white border-slate-border/60'}`}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <ErrorMessage message={error} />}
              {success && <SuccessMessage message={success} />}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold ml-0.5 ${isDark ? 'text-gray-400' : 'text-slate-body'}`}>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" disabled={loading} />
                </div>
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold ml-0.5 ${isDark ? 'text-gray-400' : 'text-slate-body'}`}>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="you@example.com" disabled={loading} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold ml-0.5 ${isDark ? 'text-gray-400' : 'text-slate-body'}`}>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="••••••••" disabled={loading} />
                </div>
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold ml-0.5 ${isDark ? 'text-gray-400' : 'text-slate-body'}`}>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field" placeholder="••••••••" disabled={loading} />
                </div>
              </div>

              {/* Role Selection */}
              <div className={`pt-4 border-t ${isDark ? 'border-dark-border/30' : 'border-slate-border/40'}`}>
                <label className={`block text-xs font-semibold mb-4 ml-0.5 ${isDark ? 'text-gray-400' : 'text-slate-body'}`}>Account Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button"
                    onClick={() => handleChange({ target: { name: "role", value: "learner" } })}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      formData.role === "learner"
                        ? isDark ? "border-cyan-400 bg-cyan-400/10 shadow-glow-cyan" : "border-indigo-500 bg-indigo-50 shadow-glow-indigo"
                        : isDark ? "border-dark-border bg-dark-elevated hover:border-gray-500" : "border-slate-border bg-white hover:border-slate-light"
                    }`}
                  >
                    <GraduationCap className={`w-6 h-6 mb-3 ${formData.role === "learner" ? (isDark ? 'text-cyan-400' : 'text-indigo-500') : (isDark ? 'text-gray-500' : 'text-slate-muted')}`} />
                    <h3 className={`text-sm font-bold mb-1 ${formData.role === "learner" ? (isDark ? "text-cyan-400" : "text-indigo-600") : (isDark ? "text-gray-200" : "text-slate-heading")}`}>Learner</h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>Access courses, track progress, and earn certifications.</p>
                  </button>
                  <button type="button"
                    onClick={() => handleChange({ target: { name: "role", value: "contributor" } })}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      formData.role === "contributor"
                        ? isDark ? "border-violet-400 bg-violet-400/10 shadow-glow-violet" : "border-teal-500 bg-teal-50 shadow-glow-teal"
                        : isDark ? "border-dark-border bg-dark-elevated hover:border-gray-500" : "border-slate-border bg-white hover:border-slate-light"
                    }`}
                  >
                    <Users className={`w-6 h-6 mb-3 ${formData.role === "contributor" ? (isDark ? 'text-violet-400' : 'text-teal-500') : (isDark ? 'text-gray-500' : 'text-slate-muted')}`} />
                    <h3 className={`text-sm font-bold mb-1 ${formData.role === "contributor" ? (isDark ? "text-violet-400" : "text-teal-600") : (isDark ? "text-gray-200" : "text-slate-heading")}`}>Contributor</h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>Create courses, publish modules, and guide learners.</p>
                  </button>
                </div>

                {formData.role === "contributor" && (
                  <div className={`mt-4 p-4 rounded-xl animate-slideIn ${isDark ? 'bg-violet-400/10 border border-violet-400/20' : 'bg-indigo-50 border border-indigo-100'}`}>
                    <p className={`text-xs font-semibold flex items-center gap-2 ${isDark ? 'text-violet-400' : 'text-indigo-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-violet-400' : 'bg-indigo-500'}`}></span>
                      Contributor accounts require admin approval
                    </p>
                  </div>
                )}
              </div>

              {/* Contributor Extra Fields */}
              {formData.role === "contributor" && (
                <div className={`space-y-4 p-5 rounded-xl border animate-slideIn ${isDark ? 'bg-dark-elevated border-dark-border/30' : 'bg-surface-subtle border-slate-border/40'}`}>
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold ml-0.5 ${isDark ? 'text-gray-400' : 'text-slate-body'}`}>Trading Experience <span className={isDark ? 'text-cyan-400' : 'text-indigo-500'}>*</span></label>
                    <input type="text" name="experience" value={formData.experience || ""} onChange={handleChange} className="input-field" placeholder="e.g. 5+ years trading stocks and crypto" disabled={loading} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold ml-0.5 ${isDark ? 'text-gray-400' : 'text-slate-body'}`}>Teaching Background <span className={isDark ? 'text-cyan-400' : 'text-indigo-500'}>*</span></label>
                    <textarea name="reason" value={formData.reason || ""} onChange={handleChange} className="input-field min-h-[100px] resize-none" placeholder="Describe your experience creating educational content..." disabled={loading} required />
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm">
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  `Create ${formData.role === "learner" ? "Learner" : "Contributor"} Account`
                )}
              </button>
            </form>

            <div className={`mt-6 text-center border-t pt-6 ${isDark ? 'border-dark-border/30' : 'border-slate-border/40'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>
                Already have an account?{" "}
                <Link to="/login" className={`font-bold transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-500 hover:text-indigo-700'}`}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
