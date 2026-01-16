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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="card">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Forgot Password?
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Enter your email and we'll send you a reset link
                        </p>
                    </div>

                    {error && <ErrorMessage message={error} />}
                    {success && <SuccessMessage message={success} />}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
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
                                className="input"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-sm text-primary-600 hover:text-primary-700"
                        >
                            ← Back to Login
                        </Link>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> If email service is not configured, the
                            reset link will be logged to the server console. Check your
                            backend terminal for the link.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
