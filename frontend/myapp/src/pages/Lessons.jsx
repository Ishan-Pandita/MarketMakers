// src/pages/Lessons.jsx — Light Theme
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Pagination from "../components/Pagination";
import ProgressBar from "../components/ProgressBar";
import LoadingSpinner from "../components/LoadingSpinner";

function Lessons() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const [lessons, setLessons] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [module, setModule] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [id, page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const lessonsRes = await API.get(`/lessons/module/${id}?page=${page}`);
      if (lessonsRes.data.lessons) { setLessons(lessonsRes.data.lessons); setPagination(lessonsRes.data.pagination); } else { setLessons(Array.isArray(lessonsRes.data) ? lessonsRes.data : []); }
      try { const moduleRes = await API.get(`/modules/${id}`); setModule(moduleRes.data); } catch (err) {}
      try { const progressRes = await API.get("/progress/me"); setCompletedLessons(new Set(progressRes.data.map((p) => (p.lessonId?._id || p.lessonId)))); } catch (err) {}
    } catch (error) { console.error("Error fetching lessons:", error); } finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;

  const completedCount = lessons.filter((l) => completedLessons.has(l._id)).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link to={module?.courseId ? `/course/${module.courseId}/modules` : "/courses"} className="text-sm font-semibold text-slate-muted hover:text-indigo-500 transition-colors flex items-center gap-2 mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Modules
        </Link>

        <div className="card p-8 mb-8">
          <h1 className="text-2xl font-bold text-slate-heading mb-2">{module?.title || "Module Lessons"}</h1>
          <p className="text-slate-body text-sm mb-6">{module?.description || "Complete these lessons to master this module."}</p>
          <div className="bg-surface-subtle rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-muted">Progress</span>
              <span className="text-xs font-bold text-indigo-500">{completedCount} / {lessons.length} completed</span>
            </div>
            <ProgressBar progress={progressPercentage} size="md" />
            <p className="text-xs text-slate-muted mt-2">{progressPercentage}% complete</p>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="text-4xl mb-4 opacity-40">📝</div>
            <h3 className="text-lg font-bold text-slate-heading mb-2">No Lessons Yet</h3>
            <p className="text-slate-muted text-sm">Lessons will be added to this module soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson._id);
              return (
                <Link key={lesson._id} to={`/lesson/${lesson._id}`} className="block card p-5 group hover:border-indigo-200">
                  <div className="flex items-center gap-5">
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-11 h-11 bg-success-light border border-success/20 text-success rounded-xl flex items-center justify-center text-lg font-bold">✓</div>
                      ) : (
                        <div className="w-11 h-11 bg-surface-subtle border border-slate-border text-slate-muted rounded-xl flex items-center justify-center text-sm font-bold group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-500 transition-all">{index + 1}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-heading truncate group-hover:text-indigo-500 transition-colors">{lesson.title}</h3>
                        {isCompleted && <span className="badge badge-success text-[10px]">Completed</span>}
                      </div>
                      <p className="text-slate-muted text-sm line-clamp-1">{lesson.explanation || "Click to view lesson"}</p>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-light">
                        {lesson.estimatedTime && <span>🕐 {lesson.estimatedTime} min</span>}
                        {lesson.videoLinks?.length > 0 && <span>🎬 {lesson.videoLinks.length} video{lesson.videoLinks.length > 1 ? "s" : ""}</span>}
                      </div>
                    </div>
                    <div className="text-slate-light group-hover:text-indigo-500 transition-colors font-bold flex-shrink-0">→</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        {pagination && <Pagination pagination={pagination} baseUrl={`/module/${id}`} />}
      </div>
    </div>
  );
}

export default Lessons;
