import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await API.get("/courses");
            setCourses(res.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
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
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-green/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-16 animate-slideIn">
                    <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background-elevated/40 backdrop-blur-md border border-neon-green/20 text-neon-green text-xs font-bold mb-6 tracking-widest uppercase">
                        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                        Library Protocol
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-500">Edge.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                        Access our elite curriculum of institutional-grade trading education. Choose a pathway to begin your journey.
                    </p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-32 glass-dark rounded-3xl border-white/5">
                        <h3 className="text-2xl font-black text-white mb-2">No Courses Found</h3>
                        <p className="text-gray-500">The library is currently offline. Check back later for updates.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, idx) => (
                            <div
                                key={course._id}
                                className="group glass-dark rounded-3xl border-white/5 overflow-hidden hover:border-neon-green/30 transition-all duration-500 hover:shadow-[0_0_30px_#00ff661a] animate-slideIn"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="h-48 bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center text-4xl border-b border-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="text-6xl drop-shadow-[0_0_15px_#ffffff33]">🎓</div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs font-black text-neon-green tracking-widest uppercase">Select Course</span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-neon-green transition-colors">{course.title}</h3>
                                    <p className="text-gray-400 text-sm mb-8 line-clamp-3 leading-relaxed">{course.description}</p>
                                    <Link
                                        to={`/course/${course._id}/modules`}
                                        className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 group/btn"
                                    >
                                        <span>Start Course</span>
                                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Courses;
