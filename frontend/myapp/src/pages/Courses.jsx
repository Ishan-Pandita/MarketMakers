import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Bitcoin, Sparkles, TrendingUp } from "lucide-react";

import LoadingSpinner from "../components/LoadingSpinner";
import usePageTitle from "../hooks/usePageTitle";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api";

const COURSE_ICONS = [TrendingUp, BarChart3, Bitcoin];

function Courses() {
  usePageTitle("Courses");
  const { isDark } = useTheme();
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);

      try {
        const [allCoursesRes, recommendedRes] = await Promise.allSettled([
          API.get("/courses"),
          API.get("/courses/recommended"),
        ]);

        setCourses(allCoursesRes.status === "fulfilled" ? allCoursesRes.value.data : []);
        setRecommendedCourses(
          recommendedRes.status === "fulfilled"
            ? recommendedRes.value.data?.courses || []
            : []
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${isDark ? "bg-dark-bg" : "bg-surface"}`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-16 ${isDark ? "bg-dark-bg" : "bg-surface"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 overflow-hidden rounded-[2rem] border p-6 shadow-elevated sm:p-8">
          <span className="badge badge-info mb-4">Learning engine</span>
          <h1 className="text-4xl font-extrabold tracking-tight font-display sm:text-5xl">
            Learn with
            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isDark ? "from-cyan-300 to-violet-300" : "from-indigo-600 to-teal-500"
              }`}
            >
              {" "}
              portfolio-aware guidance
            </span>
            .
          </h1>
          <p className={`mt-4 max-w-3xl text-base leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>
            Your assistant, dashboard, and course catalog now share context, so the catalog can
            surface the material that best matches what you own and how you learn.
          </p>
        </div>

        {recommendedCourses.length > 0 && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isDark ? "bg-cyan-400/10 text-cyan-300" : "bg-indigo-50 text-indigo-600"}`}>
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Recommended for you</h2>
                <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                  Based on your portfolio mix and recent learning activity.
                </p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {recommendedCourses.map((course, index) => {
                const Icon = COURSE_ICONS[index % COURSE_ICONS.length];

                return (
                  <Link
                    key={course._id}
                    to={`/course/${course._id}/modules`}
                    className={`group overflow-hidden rounded-[1.75rem] border p-0 shadow-card transition-all ${
                      isDark
                        ? "border-dark-border/30 bg-dark-card hover:border-cyan-400/20 hover:shadow-dark-elevated"
                        : "border-slate-border/60 bg-white hover:border-indigo-200 hover:shadow-elevated"
                    }`}
                  >
                    <div
                      className={`flex h-36 items-center justify-between px-6 ${
                        isDark
                          ? "bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(167,139,250,0.16))]"
                          : "bg-[linear-gradient(135deg,rgba(99,102,241,0.12),rgba(20,184,166,0.12))]"
                      }`}
                    >
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? "text-cyan-300" : "text-indigo-700"}`}>
                          Recommended
                        </p>
                        <p className="mt-2 text-xl font-extrabold">{course.title}</p>
                      </div>
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isDark ? "bg-dark-surface/80 text-cyan-300" : "bg-white text-indigo-600"}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="p-6">
                      <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                        {course.description}
                      </p>
                      {course.tags?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {course.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                isDark ? "bg-cyan-400/10 text-cyan-300" : "bg-indigo-50 text-indigo-700"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">All courses</h2>
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
              Explore the full curriculum across markets, asset classes, and trading foundations.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="card text-center">
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                No courses are available yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course, index) => {
                const Icon = COURSE_ICONS[index % COURSE_ICONS.length];

                return (
                  <Link
                    key={course._id}
                    to={`/course/${course._id}/modules`}
                    className={`card group overflow-hidden p-0 ${
                      isDark ? "hover:border-cyan-400/20" : "hover:border-indigo-200"
                    }`}
                  >
                    <div
                      className={`flex h-40 items-center justify-center ${
                        isDark
                          ? "bg-[linear-gradient(135deg,rgba(34,211,238,0.15),rgba(109,40,217,0.2))]"
                          : "bg-[linear-gradient(135deg,rgba(99,102,241,0.12),rgba(20,184,166,0.14))]"
                      }`}
                    >
                      <Icon className="h-12 w-12 text-white/90" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold">{course.title}</h3>
                      <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                        {course.description}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-cyan-300">
                        Start course
                        <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Courses;
