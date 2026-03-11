// src/pages/Lesson.jsx - UPGRADED VERSION (ALL BUGS FIXED)
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

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

  useEffect(() => {
    fetchLessonData();
  }, [id]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);

      // Fetch lesson
      const lessonRes = await API.get(`/lessons/${id}`);
      setLesson(lessonRes.data);

      // Fetch suggestions - FIXED: Changed /suggestionns/lessons/ to /suggestions/lesson/
      const suggestionsRes = await API.get(`/suggestions/lesson/${id}`);
      setSuggestions(suggestionsRes.data);

      // Check if lesson is completed
      try {
        const progressRes = await API.get(`/progress/check/${id}`);
        setIsCompleted(progressRes.data.completed);
      } catch (err) {
        console.log("Progress check not available");
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      setError("Failed to load lesson");
    } finally {
      setLoading(false);
    }
  };

  const addSuggestion = async () => {
    if (!text.trim()) {
      setError("Please enter a suggestion");
      return;
    }

    if (text.trim().length < 10) {
      setError("Suggestion must be at least 10 characters");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await API.post("/suggestions", {
        lessonId: id,
        text: text.trim(),
      });

      setText("");
      setSuccess("Suggestion added successfully!");

      // Refresh suggestions
      const res = await API.get(`/suggestions/lesson/${id}`);
      setSuggestions(res.data);

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add suggestion");
    } finally {
      setSubmitting(false);
    }
  };

  const markCompleted = async () => {
    try {
      setSubmitting(true);
      setError("");

      await API.post("/progress", { lessonId: id });
      setIsCompleted(true);
      setSuccess("Lesson marked as completed! 🎉");

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      if (error.response?.data?.message?.includes("already completed")) {
        setIsCompleted(true);
        setError("You already completed this lesson");
      } else {
        setError(
          error.response?.data?.message || "Failed to mark lesson as complete"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-neon-green">
        <LoadingSpinner size="large" text="Decrypting lesson data..." />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-4">
            Signal Lost
          </h2>
          <p className="text-gray-400 mb-8">Lesson data block not found on the network.</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Return to Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050505] text-white py-8 relative overflow-hidden">
      {/* Decorative background effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neon-purple/10 to-transparent pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-neon-green font-bold uppercase tracking-wider text-sm transition-colors group"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="group-hover:-translate-x-1 transition-transform">Terminal Access</span>
        </button>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6">
            <SuccessMessage message={success} onClose={() => setSuccess("")} />
          </div>
        )}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={() => setError("")} />
          </div>
        )}

        {/* Lesson Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {lesson.difficulty && (
                  <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-sm border ${lesson.difficulty === 'beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    lesson.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                    {lesson.difficulty} Level
                  </span>
                )}
                {lesson.estimatedTime && (
                  <span className="text-gray-400 text-xs font-mono flex items-center gap-2">
                    ⏱️ ETA: {lesson.estimatedTime} MIN
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {lesson.title}
              </h1>
            </div>

            {isCompleted && (
              <div className="flex-shrink-0 animate-fadeIn">
                <span className="inline-flex items-center gap-2 bg-neon-green/10 text-neon-green border border-neon-green/30 font-black tracking-widest uppercase text-sm px-6 py-3 rounded-xl shadow-[0_0_15px_#00ff6633]">
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                  Verified
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Cinematic Video Player (Placeholder styling if links exist) */}
        {lesson.videoLinks && lesson.videoLinks.length > 0 && (
          <div className="mb-12 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_#000000cc] bg-black relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-blue-500 to-neon-green opacity-50"></div>

            <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center relative group">
              {/* Replace with actual video player logic, using iframe/video tag */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>

              <div className="relative z-10 text-center scale-95 group-hover:scale-100 transition-transform duration-500">
                <a
                  href={lesson.videoLinks[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-24 h-24 rounded-full bg-neon-purple/20 border border-neon-purple/50 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm cursor-pointer hover:bg-neon-purple/40 hover:shadow-[0_0_30px_#8b5cf699] transition-all"
                >
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
                </a>
                <p className="text-white font-bold tracking-widest uppercase text-sm">Initialize Main Broadcast</p>
                <p className="text-gray-500 font-mono text-xs mt-2">{lesson.videoLinks[0]}</p>
              </div>
            </div>

            {/* Additional Videos Below Player */}
            {lesson.videoLinks.length > 1 && (
              <div className="bg-[#111] border-t border-white/5 p-6">
                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Supplementary Feeds</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lesson.videoLinks.slice(1).map((video, index) => (
                    <a
                      key={index}
                      href={video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-lg bg-black hover:bg-background-elevated border border-white/5 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-background-elevated border border-gray-800 rounded flex items-center justify-center group-hover:border-neon-purple/50 transition-colors">
                        <span className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-gray-400 border-b-[6px] border-b-transparent ml-1 group-hover:border-l-neon-purple"></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-300 text-sm truncate">Data Stream {index + 2}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lesson Content - Immersive Pane */}
        <div className="glass-dark border border-white/5 rounded-[2rem] p-8 md:p-12 mb-12 shadow-2xl relative">
          <div className="absolute top-0 right-10 w-32 h-1 bg-neon-green shadow-[0_0_15px_#00ff66]"></div>
          <h2 className="text-2xl font-black text-white mb-8 tracking-wide">
            Briefing Data
          </h2>
          <div className="prose prose-invert max-w-none text-gray-300 leading-[1.8] font-light">
            <p className="whitespace-pre-wrap text-lg">
              {lesson.explanation || "ENCRYPTED: No content data available in broadcast."}
            </p>
          </div>
        </div>

        {/* Action: Mark Complete */}
        <div className={`p-8 rounded-3xl border mb-16 transition-all duration-500 ${isCompleted
          ? 'glass-dark border-neon-green/30 bg-neon-green/5'
          : 'bg-background-elevated border-white/10 hover:border-neon-purple/50 hover:shadow-[0_0_30px_#8b5cf61a]'
          }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className={`text-2xl font-black mb-2 tracking-tight ${isCompleted ? 'text-neon-green' : 'text-white'}`}>
                {isCompleted ? "Protocol Verified" : "Data Acknowledged?"}
              </h3>
              <p className="text-gray-400 text-sm font-medium">
                {isCompleted
                  ? "Execution logged on network. Proceed to next module."
                  : "Commit completion to ledger to update portfolio edge."}
              </p>
            </div>
            <button
              onClick={markCompleted}
              disabled={isCompleted || submitting}
              className={`w-full md:w-auto px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${isCompleted
                ? 'bg-neon-green/20 text-neon-green border border-neon-green/50 cursor-default'
                : 'bg-neon-purple text-white hover:bg-[#7c3aed] shadow-[0_0_20px_#8b5cf666] hover:shadow-[0_0_30px_#8b5cf699] hover:-translate-y-1'
                }`}
            >
              {submitting ? (
                <LoadingSpinner size="small" />
              ) : isCompleted ? (
                "✓ LOGGED"
              ) : (
                "VERIFY COMPLETION"
              )}
            </button>
          </div>
        </div>

        {/* Suggestions / Network Chatter Section */}
        <div className="mt-16 border-t border-white/10 pt-16">
          <h2 className="text-2xl font-black text-white mb-8 tracking-wide">
            Network Chatter <span className="text-gray-500 font-normal">({suggestions.length})</span>
          </h2>

          {/* Add Suggestion Form */}
          <div className="mb-10 p-6 glass-dark rounded-2xl border border-white/5 relative">
            <label className="block text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
              Broadcast Message
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input-field min-h-[120px] bg-background-dark border-gray-800 focus:border-neon-purple focus:ring-neon-purple/20 text-white placeholder-gray-600 resize-none"
              placeholder="Transmit analysis, queries, or tactical feedback..."
              disabled={submitting}
            />
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
              <p className="text-xs font-mono text-gray-500">
                L: {text.length}/500{" "}
                {text.length < 10 && <span className="text-red-400">(&gt;10 REQ)</span>}
              </p>
              <button
                onClick={addSuggestion}
                disabled={submitting || text.trim().length < 10}
                className="btn-primary disabled:opacity-50 py-3 px-8 text-sm"
              >
                {submitting ? "Transmitting..." : "Send to Network"}
              </button>
            </div>
          </div>

          {/* Suggestions List */}
          {suggestions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl">
              <p className="text-gray-500 font-mono">CHANNEL EMPTY. BE THE FIRST TO BROADCAST.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion._id}
                  className="p-6 bg-background-elevated border border-gray-800 rounded-2xl relative overflow-hidden group hover:border-gray-600 transition-colors"
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-gray-800 group-hover:bg-neon-purple/50 transition-colors"></div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-800 text-gray-400 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 border border-gray-700">
                      {suggestion.userId?.name?.charAt(0).toUpperCase() || "X"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-bold text-white tracking-wide">
                          {suggestion.userId?.name || "Unknown Identity"}
                        </span>
                        {suggestion.userId?.role && (
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${suggestion.userId.role === 'contributor' ? 'text-neon-purple border-neon-purple/30 bg-neon-purple/10' : 'text-gray-400 border-gray-700 bg-gray-800'
                            }`}>
                            {suggestion.userId.role}
                          </span>
                        )}
                        <span className="text-xs text-gray-600 font-mono">
                          {new Date(suggestion.createdAt).toISOString().replace('T', ' ').slice(0, 16)}
                        </span>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap break-words leading-relaxed font-light">
                        {suggestion.text}
                      </p>
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
