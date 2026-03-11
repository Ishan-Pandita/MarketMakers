import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Contributors() {
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContributors();
    }, []);

    const fetchContributors = async () => {
        try {
            setLoading(true);
            const res = await API.get("/users/contributors");
            setContributors(res.data);
        } catch (error) {
            console.error("Error fetching contributors:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-neon-purple/20 border-t-neon-purple rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-neon-purple uppercase tracking-widest">LOADING</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] py-24 relative overflow-hidden">
            <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
                        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                        Global Network
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
                        Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-purple">Experts.</span>
                    </h1>
                    <p className="text-gray-500 font-bold max-w-2xl mx-auto text-lg">
                        Learn directly from approved contributors who share their specialized
                        strategies and knowledge.
                    </p>
                </div>

                {contributors.length === 0 ? (
                    <div className="glass-dark rounded-[40px] border-white/5 p-16 text-center max-w-lg mx-auto">
                        <div className="text-5xl mb-6 opacity-30">👤</div>
                        <p className="text-gray-400 font-bold text-lg mb-6">
                            No active contributors yet. Be the first one!
                        </p>
                        <Link to="/register" className="inline-block px-10 py-4 bg-neon-green text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-[0_0_30px_#00ff664d] hover:-translate-y-1 transition-all">
                            Create Account
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contributors.map((contributor, index) => (
                            <Link
                                key={contributor._id}
                                to={`/profile/${contributor._id}`}
                                className="glass-dark rounded-[32px] border-white/5 p-8 hover:border-white/10 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-500 group"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 border border-white/10 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:border-neon-purple/40 transition-all duration-500 font-black text-white">
                                        {contributor.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-neon-green transition-colors">
                                        {contributor.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-6 font-black uppercase tracking-widest">
                                        <span className="bg-neon-purple/10 text-neon-purple border border-neon-purple/20 px-3 py-1 rounded-lg">
                                            Contributor
                                        </span>
                                        <span className="text-gray-700">•</span>
                                        <span>
                                            Since {new Date(contributor.createdAt).getFullYear()}
                                        </span>
                                    </div>

                                    <div className="w-full bg-white/5 rounded-2xl p-5 border border-white/5 text-left">
                                        <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">
                                            Expertise
                                        </p>
                                        <p className="text-gray-400 text-sm font-bold line-clamp-2">
                                            {contributor.contributorDetails?.experience ||
                                                "General Trading"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Contributors;
