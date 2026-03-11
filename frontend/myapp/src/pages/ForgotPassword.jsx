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
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const { data } = await API.post("/auth/forgot-password", { email });
            setSuccess(data.message);
            setEmail("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 py-24 relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700"></div>

            <div className="max-w-md w-full relative z-10 animate-slideIn">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background-elevated/40 backdrop-blur-md border border-white/10 text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase mb-6">
                        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                        Recovery Link
                    </span>
                    <h2 className="text-4xl font-black text-white tracking-tight mb-4">Reset <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-500">Password.</span></h2>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Enter your email address to receive a recovery link</p>
                </div>

                <div className="glass-dark p-10 rounded-[40px] border-white/5 shadow-[0_0_80px_#000000]">
                    {error && <ErrorMessage message={error} />}
                    {success && <SuccessMessage message={success} />}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label
                                htmlFor="email"
                                className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-green/50 transition-all font-bold tracking-tight"
                                placeholder="satoshi@network.id"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 rounded-2xl bg-neon-green text-black text-[10px] font-black tracking-[0.4em] uppercase shadow-[0_0_30px_#00ff664d] hover:shadow-[0_0_50px_#00ff6680] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-wait"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className="mt-10 text-center border-t border-white/5 pt-8">
                        <Link
                            to="/login"
                            className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            ← Return to Login
                        </Link>
                    </div>

                    <div className="mt-8 p-5 bg-neon-purple/5 border border-neon-purple/10 rounded-2xl">
                        <p className="text-[10px] font-black text-neon-purple uppercase tracking-widest mb-2">⚡ Node Advisory</p>
                        <p className="text-gray-400 text-[11px] font-bold leading-relaxed">
                            If email service is not configured, the reset link will be logged to the server console. Check your backend terminal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
