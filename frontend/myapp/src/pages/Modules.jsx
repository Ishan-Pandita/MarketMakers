import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ProgressBar from "../components/ProgressBar";
import Pagination from "../components/Pagination";

function Modules() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const [modules, setModules] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchModules();
  }, [page]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/modules?page=${page}`);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Loading modules..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Learning Modules
          </h1>
          <p className="text-gray-600">
            Explore our comprehensive trading education modules
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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

        {/* Modules Grid */}
        {filteredModules.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No modules found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try a different search term"
                : "No modules available yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <div
                key={module._id}
                className="card hover:shadow-xl transition-all duration-200 group"
              >
                {/* Module Icon */}
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  📚
                </div>

                {/* Module Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {module.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {module.description || "No description available"}
                </p>

                {/* Module Meta */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>📖</span>
                    <span>{module.lessonCount || 0} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📊</span>
                    <span>Order: {module.order}</span>
                  </div>
                </div>

                {/* Progress (if available) */}
                {module.progress !== undefined && (
                  <div className="mb-4">
                    <ProgressBar percentage={module.progress} size="small" />
                  </div>
                )}

                {/* Action Button */}
                <Link
                  to={`/module/${module._id}`}
                  className="block w-full btn-primary text-center"
                >
                  View Lessons →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">
                {Array.isArray(modules) ? modules.length : 0}
              </div>
              <div className="text-gray-600 text-sm mt-1">Total Modules</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">
                {Array.isArray(modules) ? modules.reduce((sum, m) => sum + (m.lessonCount || 0), 0) : 0}
              </div>
              <div className="text-gray-600 text-sm mt-1">Total Lessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">100+</div>
              <div className="text-gray-600 text-sm mt-1">Hours of Content</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">50+</div>
              <div className="text-gray-600 text-sm mt-1">Contributors</div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {pagination && (
          <Pagination
            pagination={pagination}
            baseUrl="/modules"
          />
        )}
      </div>
    </div>
  );
}

export default Modules;
