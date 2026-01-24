import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function ContributorProfile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/users/contributors/${id}`);
            setProfile(res.data.profile);
            setModules(res.data.modules);
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Contributor not found");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Link to="/community" className="btn-primary">
                    Back to Community
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header Banner */}
            <div className="bg-primary-600 text-white pt-20 pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 opacity-50"></div>
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 bg-white text-primary-600 rounded-full flex items-center justify-center text-5xl font-bold shadow-xl border-4 border-white/20">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
                        <p className="text-primary-100 text-lg mb-4">
                            {profile.role === "admin" ? "Platform Admin" : "Expert Contributor"}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-primary-200">
                            <span className="bg-white/10 px-3 py-1 rounded-full">
                                {modules.length} Modules
                            </span>
                            <span className="bg-white/10 px-3 py-1 rounded-full">
                                Joined {new Date(profile.createdAt).getFullYear()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: About */}
                    <div className="lg:col-span-1">
                        <div className="card h-full">
                            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">
                                About the Instructor
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                        Experience
                                    </p>
                                    <p className="text-gray-700">
                                        {profile.contributorDetails?.experience || "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                        Motivation
                                    </p>
                                    <p className="text-gray-700 italic">
                                        "{profile.contributorDetails?.reason || "Here to teach!"}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Modules */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Created Modules
                            </h2>
                        </div>

                        {modules.length === 0 ? (
                            <div className="bg-white rounded-lg p-12 text-center border dashed border-gray-300">
                                <p className="text-gray-500 text-lg">
                                    {profile.name} hasn't created any modules yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {modules.map((module) => (
                                    <Link
                                        key={module._id}
                                        to={`/module/${module._id}`}
                                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all group"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                    {module.title}
                                                </h3>
                                                <p className="text-gray-600 mt-2 line-clamp-2">
                                                    {module.description}
                                                </p>
                                            </div>
                                            <div className="text-gray-300 group-hover:text-primary-500 text-2xl transition-colors">
                                                →
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContributorProfile;
