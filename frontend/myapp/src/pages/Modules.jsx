// src/pages/Modules.jsx — Light Theme
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

  useEffect(() => { fetchModules(); }, [page]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      let url = `/modules?page=${page}`;
      if (courseId) { url += `&courseId=${courseId}`; const courseRes = await API.get(`/courses/${courseId}`); setCourse(courseRes.data); }
      const res = await API.get(url);
      if (res.data.modules) { setModules(res.data.modules); setPagination(res.data.pagination); } else if (Array.isArray(res.data)) { setModules(res.data); } else { setModules([]); }
    } catch (error) { console.error("Error fetching modules:", error); setModules([]); } finally { setLoading(false); }
  };

  const filteredModules = Array.isArray(modules) ? modules.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description?.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-surface py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 animate-slideIn">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="badge badge-info mb-4">Modules</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-heading mb-4 tracking-tight font-display">
                {course ? course.title : <>All <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">Modules</span></>}
              </h1>
              <p className="text-lg text-slate-body max-w-2xl leading-relaxed">
                {course ? "Explore the modules in this course." : "Browse all available learning modules."}
              </p>
            </div>
            {courseId && user?.role === "contributor" && (
              <Link to={`/course/${courseId}/create-module`} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                <span>+ New Module</span>
              </Link>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-10 max-w-lg">
          <div className="relative">
            <input type="text" placeholder="Search modules..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-11" />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* Modules Grid */}
        {filteredModules.length === 0 ? (
          <div className="text-center py-20 card">
            <div className="text-4xl mb-4 opacity-40">🔍</div>
            <h3 className="text-xl font-bold text-slate-heading mb-2">No Modules Found</h3>
            <p className="text-slate-muted">No modules match your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredModules.map((module, idx) => (
              <div key={module._id} className="group card p-0 overflow-hidden animate-slideIn" style={{ animationDelay: `${idx * 80}ms` }}>
                <div className="p-7">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-500 rounded-xl flex items-center justify-center text-sm font-bold group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <span className="badge badge-info text-[10px]">Module</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-heading mb-2 group-hover:text-indigo-500 transition-colors">{module.title}</h3>
                  <p className="text-slate-body text-sm mb-5 line-clamp-3 leading-relaxed">{module.description || "No description available."}</p>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-surface-subtle p-3 rounded-xl">
                      <div className="text-slate-heading font-bold text-lg">{module.lessonCount || 0}</div>
                      <div className="text-xs text-slate-muted">Lessons</div>
                    </div>
                    <div className="bg-surface-subtle p-3 rounded-xl text-right">
                      <div className="text-slate-heading font-bold text-lg">{module.order}</div>
                      <div className="text-xs text-slate-muted">Order</div>
                    </div>
                  </div>

                  {module.progress !== undefined && (
                    <div className="mb-5">
                      <div className="flex justify-between text-xs text-slate-muted mb-1.5">
                        <span>Progress</span>
                        <span className="font-bold text-indigo-500">{module.progress}%</span>
                      </div>
                      <ProgressBar progress={module.progress} size="sm" />
                    </div>
                  )}

                  <Link to={`/module/${module._id}`} className="btn-primary w-full py-3 text-center text-sm">
                    View Lessons
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="card p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-slate-heading">{Array.isArray(modules) ? modules.length : 0}</div>
              <div className="text-xs text-indigo-500 font-semibold uppercase tracking-wider">Modules</div>
            </div>
            <div className="w-px h-10 bg-slate-border hidden md:block"></div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-slate-heading">{Array.isArray(modules) ? modules.reduce((sum, m) => sum + (m.lessonCount || 0), 0) : 0}</div>
              <div className="text-xs text-teal-500 font-semibold uppercase tracking-wider">Total Lessons</div>
            </div>
          </div>
        </div>

        {pagination && <Pagination pagination={pagination} baseUrl="/modules" />}
      </div>
    </div>
  );
}

export default Modules;
