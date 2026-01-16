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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Loading lesson..." />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Lesson not found
          </h2>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
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
          Back to Lessons
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
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {lesson.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {lesson.estimatedTime && (
                  <span className="flex items-center gap-1">
                    ⏱️ {lesson.estimatedTime} minutes
                  </span>
                )}
                {lesson.difficulty && (
                  <span className="badge badge-info capitalize">
                    {lesson.difficulty}
                  </span>
                )}
              </div>
            </div>

            {isCompleted && (
              <div className="flex-shrink-0">
                <span className="badge badge-success text-lg px-4 py-2">
                  ✓ Completed
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Lesson Content
          </h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p className="whitespace-pre-wrap">
              {lesson.explanation || "No content available"}
            </p>
          </div>
        </div>

        {/* Video Links */}
        {lesson.videoLinks && lesson.videoLinks.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📹</span>
              Video Resources
            </h2>
            <div className="space-y-3">
              {lesson.videoLinks.map((video, index) => (
                <a
                  key={index}
                  href={video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                    ▶️
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Video {index + 1}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{video}</p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Mark Complete Button */}
        <div className="card mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {isCompleted ? "Lesson Completed!" : "Complete this lesson"}
              </h3>
              <p className="text-gray-600 text-sm">
                {isCompleted
                  ? "You've completed this lesson. Great job!"
                  : "Mark this lesson as complete to track your progress"}
              </p>
            </div>
            <button
              onClick={markCompleted}
              disabled={isCompleted || submitting}
              className="btn-primary disabled:bg-gray-400"
            >
              {submitting ? (
                <LoadingSpinner size="small" />
              ) : isCompleted ? (
                "✓ Completed"
              ) : (
                "Mark as Complete"
              )}
            </button>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>💬</span>
            Suggestions & Feedback ({suggestions.length})
          </h2>

          {/* Add Suggestion Form */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share your thoughts or suggestions
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input-field min-h-[100px] resize-none"
              placeholder="Share your feedback, questions, or suggestions for this lesson..."
              disabled={submitting}
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500">
                {text.length}/500 characters{" "}
                {text.length < 10 && "(minimum 10)"}
              </p>
              <button
                onClick={addSuggestion}
                disabled={submitting || text.trim().length < 10}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Suggestion"}
              </button>
            </div>
          </div>

          {/* Suggestions List */}
          {suggestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No suggestions yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion._id}
                  className="p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {suggestion.userId?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {suggestion.userId?.name || "Anonymous"}
                        </span>
                        {suggestion.userId?.role && (
                          <span className="badge badge-info text-xs capitalize">
                            {suggestion.userId.role}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(suggestion.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap break-words">
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
