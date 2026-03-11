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
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const { data } = await API.post(`/auth/reset-password/${token}`, {
                newPassword,
            });
            setSuccess(data.message);

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to reset password. Token may be invalid or expired."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 py-24 relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700"></div>

            <div className="max-w-md w-full relative z-10 animate-slideIn">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background-elevated/40 backdrop-blur-md border border-white/10 text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase mb-6">
                        <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></span>
                        Security Settings
                    </span>
                    <h2 className="text-4xl font-black text-white tracking-tight mb-4">New <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-green">Password.</span></h2>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Establish your new password below</p>
                </div>

                <div className="glass-dark p-10 rounded-[40px] border-white/5 shadow-[0_0_80px_#000000]">
                    {error && <ErrorMessage message={error} />}
                    {success && (
                        <div className="mb-8">
                            <SuccessMessage message={success} />
                            <p className="text-[10px] text-center text-gray-500 font-black uppercase tracking-widest mt-3">
                                Redirecting to login...
                            </p>
                        </div>
                    )}

                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label
                                    htmlFor="newPassword"
                                    className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1"
                                >
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-bold tracking-tight"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>

                            <div className="space-y-3">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-bold tracking-tight"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 rounded-2xl bg-neon-purple text-white text-[10px] font-black tracking-[0.4em] uppercase shadow-[0_0_30px_#8b5cf64d] hover:shadow-[0_0_50px_#8b5cf680] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-wait"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                    <div className="mt-10 text-center border-t border-white/5 pt-8">
                        <Link
                            to="/login"
                            className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            ← Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
