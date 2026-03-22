// src/pages/Lesson.jsx — Light Theme
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

// Extract YouTube video ID from various URL formats
const getYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
};

function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => { fetchLessonData(); }, [id]);
  useEffect(() => { setActiveVideoIndex(0); }, [lesson]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      const lessonRes = await API.get(`/lessons/${id}`); setLesson(lessonRes.data);
      const suggestionsRes = await API.get(`/suggestions/lesson/${id}`); setSuggestions(suggestionsRes.data);
      try { const progressRes = await API.get(`/progress/check/${id}`); setIsCompleted(progressRes.data.completed); } catch (err) {}
    } catch (error) { setError("Failed to load lesson"); } finally { setLoading(false); }
  };

  const addSuggestion = async () => {
    if (!text.trim()) { setError("Please enter a suggestion"); return; }
    if (text.trim().length < 10) { setError("Suggestion must be at least 10 characters"); return; }
    try { setSubmitting(true); setError(""); await API.post("/suggestions", { lessonId: id, text: text.trim() }); setText(""); setSuccess("Suggestion added!"); const res = await API.get(`/suggestions/lesson/${id}`); setSuggestions(res.data); setTimeout(() => setSuccess(""), 3000); } catch (error) { setError(error.response?.data?.message || "Failed to add suggestion"); } finally { setSubmitting(false); }
  };

  const markCompleted = async () => {
    try { setSubmitting(true); setError(""); await API.post("/progress", { lessonId: id }); setIsCompleted(true); setSuccess("Lesson marked as completed! 🎉"); setTimeout(() => setSuccess(""), 3000); } catch (error) { if (error.response?.data?.message?.includes("already completed")) { setIsCompleted(true); setError("You already completed this lesson"); } else { setError(error.response?.data?.message || "Failed to mark lesson as complete"); } } finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;
  if (!lesson) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center"><h2 className="text-2xl font-bold text-slate-heading mb-3">Lesson Not Found</h2><p className="text-slate-muted mb-6">The lesson you're looking for doesn't exist.</p><button onClick={() => navigate(-1)} className="btn-primary">Go Back</button></div>
    </div>
  );

  const activeVideoUrl = lesson.videoLinks?.[activeVideoIndex];
  const activeVideoId = getYouTubeId(activeVideoUrl);

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-slate-muted hover:text-indigo-500 font-semibold text-sm transition-colors group">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span>Back to Lessons</span>
        </button>

        {success && <div className="mb-4"><SuccessMessage message={success} /></div>}
        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {lesson.difficulty && <span className={`badge text-[10px] ${lesson.difficulty === 'beginner' ? 'badge-success' : lesson.difficulty === 'intermediate' ? 'badge-warning' : 'bg-danger-light text-danger-dark border border-danger/20'}`}>{lesson.difficulty}</span>}
                {lesson.estimatedTime && <span className="text-xs text-slate-muted">⏱️ {lesson.estimatedTime} min</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-heading tracking-tight leading-tight font-display">{lesson.title}</h1>
            </div>
            {isCompleted && <span className="badge badge-success text-sm px-4 py-2">✓ Completed</span>}
          </div>
        </div>

        {/* Video Player */}
        {lesson.videoLinks?.length > 0 && (
          <div className="mb-8 card overflow-hidden p-0">
            {activeVideoId ? (
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  key={activeVideoId}
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoId}?rel=0&modestbranding=1`}
                  title={`Video ${activeVideoIndex + 1} — ${lesson.title}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-indigo-50 to-teal-50 flex items-center justify-center">
                <a href={activeVideoUrl} target="_blank" rel="noopener noreferrer" className="text-center group">
                  <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-200 flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500/20 transition-all">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-indigo-500 border-b-[10px] border-b-transparent ml-1.5" />
                  </div>
                  <p className="text-[#6B7280] font-semibold text-sm">Open Video</p>
                </a>
              </div>
            )}

            {/* Video selector for multiple videos */}
            {lesson.videoLinks.length > 1 && (
              <div className="bg-surface-subtle p-4 border-t border-slate-border/40">
                <h3 className="text-xs font-semibold text-slate-muted mb-3 uppercase tracking-wider">
                  {lesson.videoLinks.length} Videos — Playing {activeVideoIndex + 1} of {lesson.videoLinks.length}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lesson.videoLinks.map((video, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveVideoIndex(i)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        i === activeVideoIndex
                          ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                          : "bg-white hover:bg-indigo-50 text-slate-body border border-slate-border/40"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] ${
                        i === activeVideoIndex ? "bg-white/20" : "bg-indigo-50 text-indigo-500"
                      }`}>
                        {i === activeVideoIndex ? "▶" : i + 1}
                      </span>
                      Video {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lesson Content */}
        <div className="card p-8 md:p-10 mb-8">
          <h2 className="text-xl font-bold text-slate-heading mb-6">Lesson Content</h2>
          <div className="text-slate-body leading-[1.8] text-base">
            <p className="whitespace-pre-wrap">{lesson.explanation || "No content available for this lesson."}</p>
          </div>
        </div>

        {/* Mark Complete */}
        <div className={`p-6 rounded-2xl border mb-10 transition-all ${isCompleted ? 'bg-success-light border-success/20' : 'card hover:border-indigo-200'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className={`text-lg font-bold mb-1 ${isCompleted ? 'text-success-dark' : 'text-slate-heading'}`}>{isCompleted ? "Lesson Completed" : "Finished this lesson?"}</h3>
              <p className="text-sm text-slate-muted">{isCompleted ? "Great work! Move on to the next lesson." : "Mark this lesson as complete to track your progress."}</p>
            </div>
            <button onClick={markCompleted} disabled={isCompleted || submitting} className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-all ${isCompleted ? 'bg-success/10 text-success border border-success/20 cursor-default' : 'btn-primary'}`}>
              {submitting ? "Saving..." : isCompleted ? "✓ Completed" : "Mark Complete"}
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="border-t border-slate-border/40 pt-10">
          <h2 className="text-xl font-bold text-slate-heading mb-6">Discussion <span className="text-slate-muted font-normal">({suggestions.length})</span></h2>
          <div className="card p-5 mb-6">
            <label className="block text-xs font-semibold text-slate-body mb-2">Add a Comment</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} className="input-field min-h-[100px] resize-none" placeholder="Share your thoughts or ask a question..." disabled={submitting} />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-slate-muted">{text.length}/500 {text.length < 10 && <span className="text-danger">(min 10)</span>}</p>
              <button onClick={addSuggestion} disabled={submitting || text.trim().length < 10} className="btn-primary text-sm px-6 py-2 disabled:opacity-50">{submitting ? "Posting..." : "Post Comment"}</button>
            </div>
          </div>

          {suggestions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-border rounded-xl"><p className="text-slate-muted text-sm">No comments yet. Be the first to share!</p></div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((s) => (
                <div key={s._id} className="p-4 bg-surface-subtle rounded-xl border border-slate-border/30 group hover:border-indigo-100 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">{s.userId?.name?.charAt(0).toUpperCase() || "U"}</div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-heading text-sm">{s.userId?.name || "Anonymous"}</span>
                        {s.userId?.role && <span className={`badge text-[10px] ${s.userId.role === 'contributor' ? 'badge-role' : 'badge-info'}`}>{s.userId.role}</span>}
                        <span className="text-xs text-slate-light">{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-body text-sm whitespace-pre-wrap leading-relaxed">{s.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lesson;
