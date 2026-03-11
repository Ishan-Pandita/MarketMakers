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
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-neon-green/20 border-t-neon-green rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-neon-green font-black">MM</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] py-20 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-green/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-neon-purple/5 blur-[120px] rounded-full translate-y-1/2"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-16 animate-slideIn">
                    <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background-elevated/40 backdrop-blur-md border border-neon-green/20 text-neon-green text-xs font-bold mb-6 tracking-widest uppercase">
                        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                        Profile Settings
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-500">Settings.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                        Manage your profile details and security preferences.
                    </p>
                </div>

                {error && <ErrorMessage message={error} />}
                {success && <SuccessMessage message={success} />}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar: Profile Summary */}
                    <div className="lg:col-span-1 space-y-8 animate-slideIn">
                        <div className="glass-dark rounded-[32px] border-white/5 p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green to-blue-500"></div>
                            <div className="w-24 h-24 bg-gradient-to-br from-[#111] to-[#050505] border-2 border-white/10 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-[0_0_30px_#ffffff1a]">
                                {user.name?.[0] || "O"}
                            </div>
                            <h2 className="text-2xl font-black text-white mb-1">{user.name}</h2>
                            <p className="text-neon-green text-[10px] font-black tracking-[0.2em] uppercase mb-6">{user.role} Active</p>

                            <div className="space-y-3">
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</span>
                                    <span className="text-[10px] font-black text-neon-green uppercase tracking-widest bg-neon-green/10 px-2 py-1 rounded">Active</span>
                                </div>
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Joined</span>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contributor Upgrade Card (if learner) */}
                        {user.role === "learner" && (
                            <div className="glass-dark rounded-[32px] border-neon-purple/20 p-8 bg-neon-purple/5 relative group overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-purple/20 blur-3xl rounded-full transition-all group-hover:bg-neon-purple/40"></div>
                                <h3 className="text-lg font-black text-white mb-3 relative z-10">Become A Contributor</h3>
                                <p className="text-gray-400 text-xs mb-6 leading-relaxed relative z-10">
                                    Your current role is 'Learner'. Pass the Contributor Exam to unlock access to course creation.
                                </p>
                                <a href="/exams" className="block text-center py-3 bg-neon-purple text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-[0_0_15px_#8b5cf666] hover:shadow-[0_0_25px_#8b5cf699] transition-all relative z-10">
                                    Take the Exam
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Main Content: Forms */}
                    <div className="lg:col-span-2 space-y-8 animate-slideIn" style={{ animationDelay: '100ms' }}>
                        {/* Profile Information */}
                        <div className="glass-dark rounded-[32px] border-white/5 p-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xl">👤</div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Personal Information</h2>
                            </div>

                            <form onSubmit={handleProfileUpdate} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, name: e.target.value })
                                            }
                                            className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-green/50 transition-all font-bold tracking-tight"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, email: e.target.value })
                                            }
                                            className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-green/50 transition-all font-bold tracking-tight"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_15px_#00ff664d] hover:-translate-y-1 transition-all"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </div>

                        {/* Change Password */}
                        <div className="glass-dark rounded-[32px] border-white/5 p-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xl">🔐</div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Change Password</h2>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-8">
                                <div className="space-y-3 max-w-md">
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Current password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                currentPassword: e.target.value,
                                            })
                                        }
                                        className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-bold tracking-tight"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Min 6 characters"
                                            value={passwordData.newPassword}
                                            onChange={(e) =>
                                                setPasswordData({
                                                    ...passwordData,
                                                    newPassword: e.target.value,
                                                })
                                            }
                                            className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-bold tracking-tight"
                                            required
                                            minLength={6}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) =>
                                                setPasswordData({
                                                    ...passwordData,
                                                    confirmPassword: e.target.value,
                                                })
                                            }
                                            className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-bold tracking-tight"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-10 py-4 rounded-2xl bg-white/5 hover:bg-neon-purple border border-white/10 hover:border-neon-purple text-white hover:text-black font-black uppercase tracking-widest text-xs transition-all shadow-none hover:shadow-[0_0_20px_#8b5cf64d]"
                                    disabled={loading}
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
