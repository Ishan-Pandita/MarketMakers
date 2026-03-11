import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

function ContributorProfile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [courses, setCourses] = useState([]);
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
            setCourses(res.data.courses || []);
            setModules(res.data.modules || []);
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Contributor not found");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-neon-green/20 border-t-neon-green rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-neon-green uppercase tracking-widest">SYNC</div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6">
                <div className="text-6xl mb-6 opacity-30">⚠️</div>
                <h2 className="text-3xl font-black text-white mb-3">Node Unreachable.</h2>
                <p className="text-gray-500 mb-8 font-bold">{error}</p>
                <Link to="/community" className="px-10 py-4 bg-neon-green text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-[0_0_30px_#00ff664d] hover:-translate-y-1 transition-all">
                    Return to Network
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pb-20 relative overflow-hidden">
            {/* Header Banner */}
            <div className="relative pt-16 pb-32 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent"></div>
                <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-neon-purple/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-neon-green/5 blur-[120px] rounded-full pointer-events-none animate-pulse delay-700"></div>

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-32 h-32 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 border border-white/10 rounded-[40px] flex items-center justify-center text-5xl font-black text-white shadow-[0_0_40px_rgba(139,92,246,0.2)]">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-5xl font-black text-white tracking-tight mb-3">{profile.name}</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">
                            {profile.role === "admin" ? "Platform Architect" : "Expert Contributor"}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <span className="bg-white/5 border border-white/10 px-5 py-2 rounded-xl">
                                {courses.length} Course{courses.length !== 1 ? "s" : ""}
                            </span>
                            <span className="bg-white/5 border border-white/10 px-5 py-2 rounded-xl">
                                {modules.length} Module{modules.length !== 1 ? "s" : ""}
                            </span>
                            <span className="bg-white/5 border border-white/10 px-5 py-2 rounded-xl">
                                Since {new Date(profile.createdAt).getFullYear()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: About */}
                    <div className="lg:col-span-1">
                        <div className="glass-dark rounded-[32px] border-white/5 p-8 h-full">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 pb-4 border-b border-white/5">
                                About the Instructor
                            </h3>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">
                                        Experience
                                    </p>
                                    <p className="text-gray-300 font-bold">
                                        {profile.contributorDetails?.experience || "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">
                                        Motivation
                                    </p>
                                    <p className="text-gray-400 italic font-bold">
                                        "{profile.contributorDetails?.reason || "Here to teach!"}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Courses */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            Created <span className="text-neon-green">Courses</span>
                        </h2>

                        {courses.length === 0 ? (
                            <div className="glass-dark rounded-[32px] border-white/5 border-dashed p-16 text-center">
                                <div className="text-5xl mb-6 opacity-30">📚</div>
                                <p className="text-gray-500 font-bold text-lg">
                                    {profile.name} hasn't created any courses yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {courses.map((course) => (
                                    <Link
                                        key={course._id}
                                        to={`/course/${course._id}/modules`}
                                        className="glass-dark rounded-[28px] border-white/5 p-8 hover:border-neon-green/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300 group"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 bg-neon-green/10 border border-neon-green/20 rounded-xl flex items-center justify-center text-lg">🎓</div>
                                                    <h3 className="text-xl font-black text-white group-hover:text-neon-green transition-colors">
                                                        {course.title}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-500 font-bold line-clamp-2 text-sm ml-[52px]">
                                                    {course.description}
                                                </p>
                                            </div>
                                            <div className="text-gray-600 group-hover:text-neon-green text-2xl font-black transition-colors flex-shrink-0 ml-6">
                                                →
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Also show standalone modules if any exist without a course */}
                        {modules.length > 0 && (
                            <div className="mt-12 space-y-6">
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    Created <span className="text-neon-purple">Modules</span>
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {modules.map((module) => (
                                        <Link
                                            key={module._id}
                                            to={`/module/${module._id}`}
                                            className="glass-dark rounded-[28px] border-white/5 p-8 hover:border-neon-purple/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300 group"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-xl font-black text-white group-hover:text-neon-purple transition-colors mb-2">
                                                        {module.title}
                                                    </h3>
                                                    <p className="text-gray-500 font-bold line-clamp-2 text-sm">
                                                        {module.description}
                                                    </p>
                                                </div>
                                                <div className="text-gray-600 group-hover:text-neon-purple text-2xl font-black transition-colors flex-shrink-0 ml-6">
                                                    →
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContributorProfile;
