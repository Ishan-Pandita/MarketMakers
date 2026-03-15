// src/pages/Courses.jsx — Light Theme
import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const courseAccents = ['from-indigo-500 to-indigo-600', 'from-teal-500 to-teal-600', 'from-violet-500 to-purple-600'];
const courseEmojis = ['📈', '💱', '₿'];

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCourses(); }, []);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-surface py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 animate-slideIn">
          <span className="badge badge-info mb-4">Courses</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-heading mb-4 tracking-tight font-display">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">Path</span>
          </h1>
          <p className="text-lg text-slate-body max-w-2xl leading-relaxed">
            Access our expert-curated curriculum of professional trading education. Choose a course to begin your journey.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-24 card">
            <h3 className="text-xl font-bold text-slate-heading mb-2">No Courses Available</h3>
            <p className="text-slate-muted">Check back soon for new courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <div
                key={course._id}
                className="group card overflow-hidden p-0 animate-slideIn"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`h-44 bg-gradient-to-br ${courseAccents[idx % 3]} relative overflow-hidden flex items-center justify-center`}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="text-6xl opacity-80">{courseEmojis[idx % 3]}</div>
                  )}
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-bold text-slate-heading mb-3 group-hover:text-indigo-500 transition-colors">{course.title}</h3>
                  <p className="text-slate-body text-sm mb-6 line-clamp-3 leading-relaxed">{course.description}</p>
                  <Link
                    to={`/course/${course._id}/modules`}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Start Course</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
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
