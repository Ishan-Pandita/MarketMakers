// src/pages/Home.jsx — Light Theme Redesign
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function Home() {
  const { isAuthenticated } = useAuth();
  const [featuredModules, setFeaturedModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      const res = await API.get("/modules?limit=3");
      setFeaturedModules(res.data);
    } catch (error) {
      console.error("Failed to fetch features", error);
    } finally {
      setLoading(false);
    }
  };

  const courseColors = ['from-indigo-500 to-indigo-600', 'from-teal-500 to-teal-600', 'from-violet-500 to-purple-600'];

  return (
    <div className="bg-surface min-h-screen text-slate-heading">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-40 lg:pb-48 overflow-hidden">
        {/* Soft mesh background */}
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none"></div>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-100/40 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100/30 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white border border-slate-border/60 text-slate-muted text-xs font-semibold tracking-wide mb-8 animate-slideIn shadow-soft">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Trusted by 1,000+ Learners
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-heading mb-8 leading-[0.95] animate-slideIn font-display" style={{ animationDelay: '100ms' }}>
              Master the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-indigo-400 to-teal-500">Markets.</span>
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-slate-body leading-relaxed mb-12 animate-slideIn" style={{ animationDelay: '200ms' }}>
              The premier trading education platform connecting learners with verified experts. 
              Master stocks, forex, and crypto through structured, expert-curated courses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slideIn" style={{ animationDelay: '300ms' }}>
              {isAuthenticated ? (
                <Link
                  to="/courses"
                  className="btn-primary px-10 py-4 text-base"
                >
                  Continue Learning →
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary px-10 py-4 text-base"
                  >
                    Start Learning Free
                  </Link>
                  <Link
                    to="/community"
                    className="btn-secondary px-10 py-4 text-base"
                  >
                    Explore Courses
                  </Link>
                </>
              )}
            </div>

            {/* Social Proof */}
            <div className="mt-20 w-full animate-slideIn" style={{ animationDelay: '400ms' }}>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {[
                  { value: '1,000+', label: 'Active Learners' },
                  { value: '50+', label: 'Expert Modules' },
                  { value: '94%', label: 'Completion Rate' },
                  { value: '24/7', label: 'Platform Access' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl md:text-3xl font-extrabold text-slate-heading tracking-tight">{stat.value}</div>
                    <div className="text-xs text-slate-muted font-semibold mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 bg-white border-t border-slate-border/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div className="max-w-xl">
              <span className="text-indigo-500 font-bold text-xs tracking-widest uppercase mb-3 block">Featured</span>
              <h2 className="section-heading mb-4">Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">Curriculum</span></h2>
              <p className="section-subheading">Explore the latest modules crafted by our verified trading experts.</p>
            </div>
            <Link to="/courses" className="text-sm font-bold text-indigo-500 hover:text-indigo-700 transition-colors flex items-center gap-2">
              View All Courses <span>→</span>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredModules.length > 0 ? (
                featuredModules.map((module, idx) => (
                  <Link key={module._id} to={`/modules/${module._id}`} className="group block h-full">
                    <div className="card h-full flex flex-col overflow-hidden p-0">
                      {/* Color bar */}
                      <div className={`h-1.5 bg-gradient-to-r ${courseColors[idx % 3]}`}></div>
                      <div className="p-7 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-5">
                          <span className="badge badge-info text-[10px]">Module</span>
                          <div className="h-px flex-1 bg-slate-border/40"></div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-heading mb-3 line-clamp-2 leading-snug group-hover:text-indigo-500 transition-colors">{module.title}</h3>
                        <p className="text-slate-body text-sm leading-relaxed mb-6 line-clamp-3 flex-1">{module.description}</p>

                        <div className="pt-5 border-t border-slate-border/40 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-soft">
                              {module.contributor?.name?.[0] || "M"}
                            </div>
                            <div className="text-xs font-semibold text-slate-muted">{module.contributor?.name || "Expert"}</div>
                          </div>
                          <span className="text-xs font-bold text-indigo-500 group-hover:translate-x-1 transition-transform">View →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-16 bg-surface-subtle border border-dashed border-slate-border rounded-2xl flex flex-col items-center justify-center text-center">
                  <div className="text-4xl mb-4 opacity-40">📚</div>
                  <p className="text-sm font-bold text-slate-muted">No modules available yet</p>
                  <p className="text-slate-body text-sm mt-1">Check back soon for new courses.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-teal-500 font-bold text-xs tracking-widest uppercase mb-3 block">Why MarketMakers</span>
            <h2 className="section-heading">Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">Succeed</span></h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Large Feature Card */}
            <div className="md:col-span-2 md:row-span-2 card p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 blur-[60px] rounded-full pointer-events-none"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-6">🎓</div>
                <div className="text-5xl font-extrabold text-slate-heading mb-2 tracking-tight">1,000+</div>
                <div className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-4">Active Learners</div>
                <p className="text-slate-body leading-relaxed">Connecting learners across the globe with institutional-grade trading education available 24/7.</p>
              </div>
            </div>

            <div className="card p-8 text-center group">
              <div className="text-4xl font-extrabold text-slate-heading mb-1 tracking-tight group-hover:text-indigo-500 transition-colors">94%</div>
              <div className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Completion Rate</div>
            </div>

            <div className="card p-8 text-center group">
              <div className="text-4xl font-extrabold text-slate-heading mb-1 tracking-tight group-hover:text-teal-500 transition-colors">50+</div>
              <div className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Expert Modules</div>
            </div>

            <div className="md:col-span-2 card p-8 flex items-center justify-between group">
              <div>
                <div className="text-2xl font-bold text-slate-heading mb-1">Structured Learning</div>
                <div className="text-sm text-slate-muted font-medium">Courses, modules, lessons & certifications</div>
              </div>
              <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all">📊</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-teal-500"></div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight font-display">
            Ready to Start Your<br />Trading Journey?
          </h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-xl mx-auto">
            Join thousands of learners mastering the markets with expert guidance and structured education.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-elevated hover:shadow-lg hover:-translate-y-1 transition-all text-base"
          >
            <span>Get Started Free</span>
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
