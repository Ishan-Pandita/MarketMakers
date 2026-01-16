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

            // Redirect to login after 2 seconds
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="card">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Enter your new password below
                        </p>
                    </div>

                    {error && <ErrorMessage message={error} />}
                    {success && (
                        <div className="mb-6">
                            <SuccessMessage message={success} />
                            <p className="text-sm text-center text-gray-600 mt-2">
                                Redirecting to login...
                            </p>
                        </div>
                    )}

                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2"
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
                                    className="input"
                                    placeholder="Enter new password"
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2"
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
                                    className="input"
                                    placeholder="Confirm new password"
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-sm text-primary-600 hover:text-primary-700"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
