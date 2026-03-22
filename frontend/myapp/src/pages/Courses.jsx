// src/pages/Courses.jsx — Dual Theme
import usePageTitle from "../hooks/usePageTitle";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { TrendingUp, DollarSign, Bitcoin } from "lucide-react";

const CourseIcon = ({ idx, isDark }) => {
  const icons = [TrendingUp, DollarSign, Bitcoin];
  const Icon = icons[idx % 3];
  return <Icon className="w-12 h-12 opacity-80 text-white" />;
};

function Courses() {
  usePageTitle("Courses");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  const courseAccents = isDark
    ? ['from-cyan-500 to-cyan-600', 'from-violet-500 to-violet-600', 'from-emerald-500 to-emerald-600']
    : ['from-indigo-500 to-indigo-600', 'from-teal-500 to-teal-600', 'from-violet-500 to-purple-600'];

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try { setLoading(true); const res = await API.get("/courses"); setCourses(res.data); }
    catch (error) { console.error("Error fetching courses:", error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-dark-bg' : 'bg-surface'}`}><LoadingSpinner /></div>;

  return (
    <div className={`min-h-screen py-16 ${isDark ? 'bg-dark-bg' : 'bg-surface'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 animate-slideIn">
          <span className="badge badge-info mb-4">Courses</span>
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 tracking-tight font-display ${isDark ? 'text-gray-100' : 'text-slate-heading'}`}>
            Choose Your <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-cyan-400 to-violet-400' : 'from-indigo-500 to-teal-500'}`}>Path</span>
          </h1>
          <p className={`text-lg max-w-2xl leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-body'}`}>
            Access our expert-curated curriculum of professional trading education. Choose a course to begin your journey.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-24 card">
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-slate-heading'}`}>No Courses Available</h3>
            <p className={isDark ? 'text-gray-500' : 'text-slate-muted'}>Check back soon for new courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <div key={course._id} className="group card overflow-hidden p-0 animate-slideIn" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={`h-44 bg-gradient-to-br ${courseAccents[idx % 3]} relative overflow-hidden flex items-center justify-center`}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <CourseIcon idx={idx} isDark={isDark} />
                  )}
                </div>
                <div className="p-7">
                  <h3 className={`text-xl font-bold mb-3 transition-colors ${isDark ? 'text-gray-100 group-hover:text-cyan-400' : 'text-slate-heading group-hover:text-indigo-500'}`}>{course.title}</h3>
                  <p className={`text-sm mb-6 line-clamp-3 leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-body'}`}>{course.description}</p>
                  <Link to={`/course/${course._id}/modules`} className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm">
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
