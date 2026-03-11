// src/pages/Register.jsx - NEW FILE
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import LoadingSpinner from "../components/LoadingSpinner";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "learner",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const validate = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      formData.experience,
      formData.reason
    );

    setLoading(false);

    if (result.success) {
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000"></div>

      <div className="max-w-2xl w-full relative z-10 animate-slideIn transition-all duration-700">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background-elevated/40 backdrop-blur-md border border-white/10 text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></span>
            Join Network
          </span>
          <h2 className="text-5xl font-black text-white tracking-tight mb-4">Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-green">Account.</span></h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Establish your trading identity on the global platform</p>
        </div>

        <div className="glass-dark p-12 rounded-[40px] border-white/5 shadow-[0_0_80px_#000000] relative group">
          <div className="absolute -top-[1px] -right-[1px] w-16 h-16 border-t-2 border-r-2 border-neon-purple rounded-tr-[40px] opacity-20 group-hover:opacity-100 transition-all duration-500"></div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {error && (
              <ErrorMessage message={error} onClose={() => setError("")} />
            )}
            {success && <SuccessMessage message={success} />}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-bold tracking-tight"
                  placeholder="Satoshi Nakamoto"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-green/50 transition-all font-bold tracking-tight"
                  placeholder="satoshi@network.id"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Password */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-white/20 transition-all font-bold tracking-tight"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-white/20 transition-all font-bold tracking-tight"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role Selection - Bento Style */}
            <div className="pt-8 border-t border-white/5">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8 text-center underline decoration-neon-purple underline-offset-8">
                Select Account Type
              </label>
              <div className="grid sm:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: "role", value: "learner" } })}
                  className={`p-8 rounded-[32px] border-2 text-left transition-all duration-500 relative overflow-hidden group/role ${formData.role === "learner"
                    ? "border-neon-green/50 bg-neon-green/5 shadow-[0_0_30px_#00ff661a]"
                    : "border-white/5 bg-black/20 hover:border-white/10"
                    }`}
                >
                  <div className={`absolute top-4 right-4 ${formData.role === "learner" ? "opacity-100" : "opacity-0"} transition-all duration-500`}>
                    <div className="w-3 h-3 rounded-full bg-neon-green shadow-glow animate-pulse"></div>
                  </div>
                  <div className="text-4xl mb-6 grayscale group-hover/role:grayscale-0 transition-all">👨‍🎓</div>
                  <h3 className={`text-xl font-black tracking-tighter mb-2 ${formData.role === "learner" ? "text-neon-green" : "text-white"}`}>LEARNER</h3>
                  <p className="text-gray-500 text-[11px] font-bold leading-relaxed">Access educational courses, track market data, and practice trading strategies.</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: "role", value: "contributor" } })}
                  className={`p-8 rounded-[32px] border-2 text-left transition-all duration-500 relative overflow-hidden group/role ${formData.role === "contributor"
                    ? "border-neon-purple/50 bg-neon-purple/5 shadow-[0_0_30px_#8b5cf61a]"
                    : "border-white/5 bg-black/20 hover:border-white/10"
                    }`}
                >
                  <div className={`absolute top-4 right-4 ${formData.role === "contributor" ? "opacity-100" : "opacity-0"} transition-all duration-500`}>
                    <div className="w-3 h-3 rounded-full bg-neon-purple shadow-glow animate-pulse"></div>
                  </div>
                  <div className="text-4xl mb-6 grayscale group-hover/role:grayscale-0 transition-all">👨‍🏫</div>
                  <h3 className={`text-xl font-black tracking-tighter mb-2 ${formData.role === "contributor" ? "text-neon-purple" : "text-white"}`}>CONTRIBUTOR</h3>
                  <p className="text-gray-500 text-[11px] font-bold leading-relaxed">Create and publish courses, guide other learners, and contribute to the platform.</p>
                </button>
              </div>

              {formData.role === "contributor" && (
                <div className="mt-8 bg-neon-purple/5 border border-neon-purple/10 p-6 rounded-2xl animate-shake">
                  <p className="text-[10px] font-black text-neon-purple uppercase tracking-[0.2em] flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-neon-purple animate-ping"></span>
                    Manual Verification Required
                  </p>
                  <p className="text-gray-400 text-[11px] font-bold mt-2 leading-relaxed">Contributor access requires account review and manual approval by network administrators.</p>
                </div>
              )}
            </div>

            {/* Contributor Extra Fields */}
            {formData.role === "contributor" && (
              <div className="space-y-8 bg-white/[0.02] p-8 rounded-[32px] border border-white/5 animate-slideDown">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                    Trading Experience <span className="text-neon-purple">*</span>
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience || ""}
                    onChange={handleChange}
                    className="w-full bg-black/60 border border-white/5 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-bold tracking-tight"
                    placeholder="e.g. 5+ years trading crypto and equities"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                    Teaching Background <span className="text-neon-purple">*</span>
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason || ""}
                    onChange={handleChange}
                    className="w-full bg-black/60 border border-white/5 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-bold tracking-tight min-h-[120px] resize-none"
                    placeholder="Outline your experience producing educational content..."
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-6 rounded-2xl text-[11px] font-black tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 ${formData.role === "learner"
                ? "bg-neon-green text-black shadow-[0_0_30px_#00ff664d] hover:shadow-[0_0_50px_#00ff6680]"
                : "bg-neon-purple text-white shadow-[0_0_30px_#8b5cf64d] hover:shadow-[0_0_50px_#8b5cf680]"
                } ${loading ? 'opacity-50 cursor-wait' : 'hover:-translate-y-1'}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create {formData.role === "learner" ? "Learner" : "Contributor"} Account</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-12 text-center border-t border-white/5 pt-10">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white hover:text-neon-green transition-all ml-2 underline decoration-white/20 underline-offset-8"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
