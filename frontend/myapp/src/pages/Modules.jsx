import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useSearchParams, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ProgressBar from "../components/ProgressBar";
import Pagination from "../components/Pagination";
import { useAuth } from "../context/AuthContext";

function Modules() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchModules();
  }, [page]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      let url = `/modules?page=${page}`;
      if (courseId) {
        url += `&courseId=${courseId}`;
        // Also fetch course details
        const courseRes = await API.get(`/courses/${courseId}`);
        setCourse(courseRes.data);
      }
      const res = await API.get(url);
      // Handle paginated response
      if (res.data.modules) {
        setModules(res.data.modules);
        setPagination(res.data.pagination);
      } else if (Array.isArray(res.data)) {
        setModules(res.data);
      } else {
        setModules([]);
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredModules = Array.isArray(modules) ? modules.filter(
    (module) =>
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-neon-purple/20 border-t-neon-purple rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-neon-purple font-black">MM</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-20 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-green/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 blur-[120px] rounded-full translate-y-1/2 translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="mb-16 animate-slideIn">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background-elevated/40 backdrop-blur-md border border-neon-purple/20 text-neon-purple text-xs font-bold mb-6 tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></span>
                Curriculum Module
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                {course ? course.title : <span>Module <span className="text-neon-purple">X</span></span>}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                {course ? "Master the architecture of this curriculum." : "Explore the specialized modules designed for market dominance."}
              </p>
            </div>
            {courseId && user?.role === "contributor" && (
              <Link
                to={`/course/${courseId}/create-module`}
                className="btn-secondary py-4 px-8 flex items-center gap-2 group whitespace-nowrap"
              >
                <span>Initialize Module</span>
                <span className="group-hover:rotate-90 transition-transform duration-300">+</span>
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar - Stylized as a terminal command */}
        <div className="mb-12 animate-slideIn" style={{ animationDelay: '100ms' }}>
          <div className="relative group max-w-xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 backdrop-blur-xl border border-white/10 text-white px-14 py-5 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-mono text-sm tracking-tight"
              />
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-purple"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        {filteredModules.length === 0 ? (
          <div className="text-center py-32 glass-dark rounded-3xl border-white/5 animate-slideIn">
            <div className="text-6xl mb-6 grayscale opacity-50">🔍</div>
            <h3 className="text-2xl font-black text-white mb-2">Null Set</h3>
            <p className="text-gray-500">No modules match your current query parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredModules.map((module, idx) => (
              <div
                key={module._id}
                className="group glass-dark rounded-3xl border-white/5 p-8 hover:border-neon-purple/40 transition-all duration-500 hover:shadow-[0_0_40px_#8b5cf61a] animate-slideIn relative overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/5 blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                {/* Module Icon/Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple rounded-2xl flex items-center justify-center text-3xl group-hover:bg-neon-purple group-hover:text-black transition-all duration-500 shadow-[0_0_15px_#8b5cf633]">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                    <span className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Module</span>
                  </div>
                </div>

                {/* Module Info */}
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-neon-purple transition-colors">
                  {module.title}
                </h3>
                <p className="text-gray-400 text-sm mb-8 line-clamp-3 leading-relaxed">
                  {module.description || "No tactical description available for this module."}
                </p>

                {/* Module Meta Bento Pane */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <div className="text-white font-black text-lg mb-0.5">{module.lessonCount || 0}</div>
                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Lessons</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-right">
                    <div className="text-white font-black text-lg mb-0.5">{module.order}</div>
                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Sequence</div>
                  </div>
                </div>

                {/* Progress (if available) */}
                {module.progress !== undefined && (
                  <div className="mb-8">
                    <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                      <span>Sync Progress</span>
                      <span className="text-neon-purple">{module.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-neon-purple shadow-[0_0_10px_#8b5cf6] transition-all duration-1000"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  to={`/module/${module._id}`}
                  className="block w-full py-4 text-center rounded-2xl bg-white/5 hover:bg-neon-purple hover:text-black border border-white/10 hover:border-neon-purple font-black transition-all duration-300 transform group-hover:-translate-y-1"
                >
                  Enter Theater
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer / Mission Control */}
        <div className="mb-20 animate-slideIn" style={{ animationDelay: '300ms' }}>
          <div className="glass-dark rounded-[40px] border-white/5 p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 to-transparent"></div>
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="text-center md:text-left">
                <div className="text-5xl font-black text-white mb-2">{Array.isArray(modules) ? modules.length : 0}</div>
                <div className="text-neon-purple text-xs font-black uppercase tracking-[0.3em]">Operational Modules</div>
              </div>
              <div className="w-px h-16 bg-white/10 hidden md:block"></div>
              <div className="text-center md:text-left">
                <div className="text-5xl font-black text-white mb-2">{Array.isArray(modules) ? modules.reduce((sum, m) => sum + (m.lessonCount || 0), 0) : 0}</div>
                <div className="text-blue-400 text-xs font-black uppercase tracking-[0.3em]">Total Tactical Lessons</div>
              </div>
              <div className="md:ml-auto">
                <div className="bg-neon-purple/20 border border-neon-purple/40 px-6 py-3 rounded-full">
                  <span className="text-neon-purple font-black text-xs uppercase tracking-widest">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex justify-center animate-slideIn">
            <Pagination
              pagination={pagination}
              baseUrl="/modules"
              className="bg-transparent text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Modules;
