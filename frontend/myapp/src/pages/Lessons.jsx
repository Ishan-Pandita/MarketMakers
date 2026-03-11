// src/pages/Lessons.jsx - DARK MODE REDESIGN
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Pagination from "../components/Pagination";

function Lessons() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const [lessons, setLessons] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [module, setModule] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id, page]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const lessonsRes = await API.get(`/lessons/module/${id}?page=${page}`);
      if (lessonsRes.data.lessons) {
        setLessons(lessonsRes.data.lessons);
        setPagination(lessonsRes.data.pagination);
      } else {
        setLessons(Array.isArray(lessonsRes.data) ? lessonsRes.data : []);
      }

      try {
        const moduleRes = await API.get(`/modules/${id}`);
        setModule(moduleRes.data);
      } catch (err) {
        console.log("Module details not available");
      }

      try {
        const progressRes = await API.get("/progress/me");
        const completed = new Set(
          progressRes.data.map((p) => (p.lessonId?._id || p.lessonId))
        );
        setCompletedLessons(completed);
      } catch (err) {
        console.log("Progress not available");
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-neon-purple/20 border-t-neon-purple rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-neon-purple uppercase tracking-widest">LOAD</div>
        </div>
      </div>
    );
  }

  const completedCount = lessons.filter((l) =>
    completedLessons.has(l._id)
  ).length;
  const progressPercentage =
    lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#050505] py-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-purple/5 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-10">
          <Link
            to={module?.courseId ? `/course/${module.courseId}/modules` : "/courses"}
            className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-neon-green transition-colors flex items-center gap-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course Curriculum
          </Link>
        </div>

        {/* Module Header */}
        <div className="glass-dark p-10 rounded-[40px] border-white/5 mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight mb-3">
            {module?.title || "Module Lessons"}
          </h1>
          <p className="text-gray-500 font-bold mb-8">
            {module?.description || "Complete these lessons to master this module"}
          </p>

          {/* Progress Bar */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Execution Progress
              </span>
              <span className="text-[10px] font-black text-neon-green uppercase tracking-widest">
                {completedCount} / {lessons.length} deployed
              </span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-neon-green to-blue-500 h-2.5 rounded-full transition-all duration-700 shadow-[0_0_10px_#00ff6680]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-600 font-black mt-3 uppercase tracking-widest">
              {progressPercentage}% synchronized
            </p>
          </div>
        </div>

        {/* Lessons List */}
        {lessons.length === 0 ? (
          <div className="glass-dark rounded-[40px] border-white/5 p-16 text-center">
            <div className="text-5xl mb-6 opacity-30">📝</div>
            <h3 className="text-xl font-black text-white mb-3">Archive Empty</h3>
            <p className="text-gray-500 font-bold">Lessons will be synthesized soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson._id);

              return (
                <Link
                  key={lesson._id}
                  to={`/lesson/${lesson._id}`}
                  className="block glass-dark rounded-[28px] border-white/5 p-8 hover:border-white/10 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-6">
                    {/* Lesson Number & Status */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-14 h-14 bg-neon-green/10 border border-neon-green/30 text-neon-green rounded-2xl flex items-center justify-center text-xl font-black shadow-[0_0_15px_#00ff6633]">
                          ✓
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-white/5 border border-white/10 text-gray-400 rounded-2xl flex items-center justify-center text-lg font-black group-hover:bg-neon-purple/10 group-hover:border-neon-purple/30 group-hover:text-neon-purple transition-all">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-black text-white truncate group-hover:text-neon-green transition-colors">
                          {lesson.title}
                        </h3>
                        {isCompleted && (
                          <span className="text-[8px] font-black text-neon-green bg-neon-green/10 border border-neon-green/20 px-3 py-1 rounded-lg uppercase tracking-widest flex-shrink-0">
                            Deployed
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm font-bold line-clamp-1">
                        {lesson.explanation || "Click to view lesson details"}
                      </p>

                      {/* Lesson Meta */}
                      <div className="flex items-center gap-6 mt-3 text-[10px] text-gray-600 font-black uppercase tracking-widest">
                        {lesson.estimatedTime && (
                          <span className="flex items-center gap-2">🕐 {lesson.estimatedTime} min</span>
                        )}
                        {lesson.videoLinks && lesson.videoLinks.length > 0 && (
                          <span className="flex items-center gap-2">🎬 {lesson.videoLinks.length} video{lesson.videoLinks.length > 1 ? "s" : ""}</span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-gray-600 group-hover:text-neon-green transition-colors text-xl font-black flex-shrink-0">→</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <Pagination
            pagination={pagination}
            baseUrl={`/module/${id}`}
          />
        )}
      </div>
    </div>
  );
}

export default Lessons;
