// src/pages/Lessons.jsx - UPGRADED VERSION (ALL BUGS FIXED)
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
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

      // Fetch lessons
      const lessonsRes = await API.get(`/lessons/module/${id}?page=${page}`);
      if (lessonsRes.data.lessons) {
        setLessons(lessonsRes.data.lessons);
        setPagination(lessonsRes.data.pagination);
      } else {
        setLessons(Array.isArray(lessonsRes.data) ? lessonsRes.data : []);
      }

      // Fetch module details
      try {
        const moduleRes = await API.get(`/modules/${id}`);
        setModule(moduleRes.data);
      } catch (err) {
        console.log("Module details not available");
      }

      // Fetch user's progress to see which lessons are completed
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Loading lessons..." />
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/modules"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
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
            Back to Modules
          </Link>
        </div>

        {/* Module Header */}
        <div className="card mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {module?.title || "Module Lessons"}
          </h1>
          <p className="text-gray-600 mb-6">
            {module?.description ||
              "Complete these lessons to master this module"}
          </p>

          {/* Progress Bar */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Your Progress
              </span>
              <span className="text-sm font-medium text-gray-700">
                {completedCount} / {lessons.length} lessons
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {progressPercentage}% complete
            </p>
          </div>
        </div>

        {/* Lessons List */}
        {lessons.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No lessons yet
            </h3>
            <p className="text-gray-600">Lessons will be added soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson._id); // FIXED: Changed l.id to lesson._id

              return (
                <Link
                  key={lesson._id} // FIXED: Changed l.id to lesson._id
                  to={`/lesson/${lesson._id}`} // FIXED: Changed l.id to lesson._id
                  className="block card hover:shadow-xl transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    {/* Lesson Number & Status */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold">
                          ✓
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-lg font-bold group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {lesson.title}
                        </h3>
                        {isCompleted && (
                          <span className="badge badge-success flex-shrink-0">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {lesson.explanation || "Click to view lesson details"}
                      </p>

                      {/* Lesson Meta */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {lesson.estimatedTime && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {lesson.estimatedTime} min
                          </span>
                        )}
                        {lesson.videoLinks && lesson.videoLinks.length > 0 && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            {lesson.videoLinks.length} video
                            {lesson.videoLinks.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <svg
                      className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
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
