// src/pages/Home.jsx - ULTIMATE VERSION
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
      // Fetch latest 3 modules
      const res = await API.get("/modules?limit=3");
      setFeaturedModules(res.data);
    } catch (error) {
      console.error("Failed to fetch features", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-slideIn">
            <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/50 backdrop-blur-md border border-white/40 text-primary-700 text-sm font-bold mb-8 shadow-sm hover:scale-105 transition-transform cursor-default">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
              Live Trading Education Platform
            </span>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-gray-900 mb-8 leading-tight">
              Master the Markets <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                Like a Pro
              </span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Join an elite community of traders. Learn from{" "}
              <span className="font-semibold text-gray-900">verified experts</span>,
              access proprietary modules, and certify your skills.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  to="/modules"
                  className="btn-primary text-lg px-10 py-4 shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40"
                >
                  Go to Classroom
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-lg px-10 py-4 shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40"
                  >
                    Start Learning Free
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary glass text-lg px-10 py-4"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Modules Section (Dynamic) */}
      <div className="py-24 bg-white/50 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Curriculum
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore top-rated modules created by our verified contributors.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredModules.length > 0 ? (
                featuredModules.map((module) => (
                  <div
                    key={module._id}
                    className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary-600/5 group-hover:bg-primary-600/10 transition-colors"></div>
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        📚
                      </span>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold tracking-wider uppercase text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                          Module
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(module.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {module.title}
                      </h3>

                      <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                        {module.description}
                      </p>

                      <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                          {/* Fallback avatar if no image */}
                          {module.contributor?.name?.[0] || "O"}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 uppercase font-semibold">
                            Owner & Instructor
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {module.contributor?.name || "MarketMakers"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  No modules available yet. Be the first to create one!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Section with Glassmorphism */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="glass-dark rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 opacity-90"></div>
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Active Learners", value: "1,000+", icon: "👨‍🎓" },
              { label: "Premium Modules", value: "50+", icon: "📚" },
              { label: "Verified Experts", value: "12+", icon: "💎" },
              { label: "Success Rate", value: "94%", icon: "📈" },
            ].map((stat, idx) => (
              <div key={idx} className="group">
                <div className="text-4xl mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-blue-200 font-bold tracking-widest uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="pb-32 pt-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of traders who are redefining their financial future.
          </p>
          <Link
            to="/register"
            className="btn-primary text-xl px-12 py-5 shadow-2xl hover:scale-105 transition-transform inline-flex items-center gap-3"
          >
            <span>Create Free Account</span>
            <span className="text-2xl">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
