import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

function Profile() {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Profile form
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
    });

    // Password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                email: user.email || "",
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const { data } = await API.put("/auth/profile", profileData);

            // Update user in context
            const token = localStorage.getItem("token");
            login(token, data);

            setSuccess("Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await API.put("/auth/change-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            setSuccess("Password changed successfully!");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

                {error && <ErrorMessage message={error} />}
                {success && <SuccessMessage message={success} />}

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Profile Information */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Profile Information
                        </h2>

                        <form onSubmit={handleProfileUpdate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, name: e.target.value })
                                    }
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, email: e.target.value })
                                    }
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    value={user.role}
                                    className="input bg-gray-100"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {user.role === "learner"
                                        ? "Pass the contributor exam to upgrade your role"
                                        : "You have contributor access"}
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Change Password
                        </h2>

                        <form onSubmit={handlePasswordChange}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            currentPassword: e.target.value,
                                        })
                                    }
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            newPassword: e.target.value,
                                        })
                                    }
                                    className="input"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    className="input"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? "Changing..." : "Change Password"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Account Stats */}
                <div className="card mt-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Account Statistics
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-primary-600">
                                {user.role}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Current Role</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-primary-600">
                                {user.email}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Email</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-primary-600">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Member Since</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-primary-600">Active</div>
                            <div className="text-sm text-gray-600 mt-1">Status</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
