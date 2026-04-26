// src/pages/Home.jsx -- Immersive 3D Scroll-Driven Homepage (Dual Theme)
import usePageTitle from "../hooks/usePageTitle";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountUp from "react-countup";
import HeroGlobe from "../components/HeroGlobe";
import { GraduationCap, TrendingUp, BookOpen, Clock, Rocket, BookMarked, Target, Trophy } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  usePageTitle("");
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [featuredModules, setFeaturedModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refs for GSAP scroll animations
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroCTARef = useRef(null);
  const statsRef = useRef(null);
  const statCardsRef = useRef([]);
  const coursesRef = useRef(null);
  const courseCardsRef = useRef([]);
  const timelineRef = useRef(null);
  const timelineNodesRef = useRef([]);
  const testimonialsRef = useRef(null);
  const testimonialCardsRef = useRef([]);
  const ctaRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroTitleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(heroSubRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
      );
      gsap.fromTo(heroCTARef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.7 }
      );
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 70%",
        onEnter: () => setStatsVisible(true),
      });
      statCardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, delay: i * 0.12, ease: "power2.out",
            scrollTrigger: { trigger: statsRef.current, start: "top 75%" } }
        );
      });
      courseCardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 80, opacity: 0, rotateY: -15 + i * 10, scale: 0.9 },
          { y: 0, opacity: 1, rotateY: 0, scale: 1, duration: 0.8, delay: i * 0.15, ease: "power3.out",
            scrollTrigger: { trigger: coursesRef.current, start: "top 70%" } }
        );
      });
      timelineNodesRef.current.forEach((node, i) => {
        if (!node) return;
        gsap.fromTo(node,
          { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: node, start: "top 80%" } }
        );
      });
      testimonialCardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 40 + i * 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: i * 0.1, ease: "power2.out",
            scrollTrigger: { trigger: testimonialsRef.current, start: "top 75%" } }
        );
      });
      gsap.fromTo(ctaRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 80%" } }
      );
    });
    return () => ctx.revert();
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

  const courseColors = isDark
    ? ["from-cyan-400 to-cyan-500", "from-violet-400 to-violet-500", "from-emerald-400 to-emerald-500"]
    : ["from-indigo-500 to-indigo-600", "from-teal-500 to-teal-600", "from-violet-500 to-purple-600"];

  const stats = [
    { end: 1000, suffix: "+", label: "Active Learners", Icon: GraduationCap },
    { end: 94, suffix: "%", label: "Completion Rate", Icon: TrendingUp },
    { end: 50, suffix: "+", label: "Expert Modules", Icon: BookOpen },
    { end: 24, suffix: "/7", label: "Platform Access", Icon: Clock },
  ];

  const timelineSteps = [
    { step: "01", title: "Enroll", desc: "Choose from curated courses designed by verified trading experts with real market experience.", Icon: Rocket },
    { step: "02", title: "Learn", desc: "Progress through structured modules with video lessons, practical examples, and real market case studies.", Icon: BookMarked },
    { step: "03", title: "Practice", desc: "Apply your knowledge with interactive exercises and paper trading simulations.", Icon: Target },
    { step: "04", title: "Certify", desc: "Validate your skills with certification exams and earn credentials recognized by the community.", Icon: Trophy },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Stock Market Contributor", quote: "MarketMakers gave me the platform to share my 8+ years of trading experience with aspiring traders worldwide.", initials: "PS" },
    { name: "Arjun Mehta", role: "Learner -- Crypto Trading", quote: "The structured curriculum and certification exams helped me go from complete beginner to confident trader in 3 months.", initials: "AM" },
    { name: "Rajesh Kapoor", role: "Forex Contributor", quote: "An incredible platform that bridges the gap between theoretical knowledge and practical trading strategies.", initials: "RK" },
  ];

  const dotColor = isDark ? '#DFE2F3' : '#1a1a2e';
  const ringStroke = isDark ? '#313442' : '#e5e7eb';

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-dark-bg text-gray-100' : 'bg-surface text-slate-heading'}`}>
      {/* ═══ HERO SECTION ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {isDark ? (
            <>
              <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full" />
              <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-violet-500/10 blur-[100px] rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full" />
            </>
          ) : (
            <>
              <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-indigo-100/40 blur-[120px] rounded-full" />
              <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-teal-100/30 blur-[100px] rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/20 blur-[150px] rounded-full" />
            </>
          )}
        </div>

        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div ref={heroTitleRef}>
                <div className={`inline-flex items-center gap-2 py-2 px-4 rounded-full backdrop-blur text-xs font-semibold tracking-wide mb-8 shadow-sm ${
                  isDark ? 'bg-dark-card/80 border border-dark-border/30 text-gray-400' : 'bg-white/80 border border-slate-200/60 text-slate-500'
                }`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDark ? 'bg-cyan-400' : 'bg-teal-400'}`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? 'bg-cyan-500' : 'bg-teal-500'}`} />
                  </span>
                  Trusted by 1,000+ Learners
                </div>

                <h1 className={`text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[0.95] font-display mb-8 ${isDark ? 'text-gray-100' : 'text-[#1A1A2E]'}`}>
                  Master the{" "}
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
                    isDark ? 'from-cyan-400 via-cyan-300 to-violet-400' : 'from-indigo-600 via-indigo-500 to-teal-500'
                  }`}>
                    Markets.
                  </span>
                </h1>
              </div>

              <p ref={heroSubRef} className={`max-w-lg text-lg leading-relaxed mb-10 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                The premier trading education platform connecting learners with verified experts.
                Master stocks, forex, and crypto through structured courses.
              </p>

              <div ref={heroCTARef} className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/courses" className="btn-primary px-10 py-4 text-base">
                    Continue Learning ->
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className={`inline-flex items-center justify-center gap-2 px-10 py-4 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-base ${
                      isDark ? 'bg-cyan-400 text-dark-bg hover:bg-cyan-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}>
                      Start Learning Free
                    </Link>
                    <Link to="/courses" className={`inline-flex items-center justify-center gap-2 px-10 py-4 font-bold rounded-xl border-2 transition-all text-base ${
                      isDark ? 'bg-transparent text-gray-300 border-dark-border hover:border-cyan-400/40 hover:text-cyan-400' : 'bg-white text-[#1A1A2E] border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}>
                      Explore Courses
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="hidden lg:block h-[500px] relative">
              <HeroGlobe />
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className={`text-xs font-semibold tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Scroll</span>
          <div className={`w-6 h-10 border-2 rounded-full flex justify-center pt-2 ${isDark ? 'border-gray-600' : 'border-slate-300'}`}>
            <div className={`w-1.5 h-3 rounded-full animate-bounce ${isDark ? 'bg-gray-500' : 'bg-slate-400'}`} />
          </div>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section ref={statsRef} className={`py-32 relative overflow-hidden ${isDark ? 'bg-dark-surface' : 'bg-white'}`}>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className={`font-bold text-xs tracking-[0.2em] uppercase mb-4 block ${isDark ? 'text-cyan-400' : 'text-teal-500'}`}>
              Platform Impact
            </span>
            <h2 className={`text-4xl md:text-6xl font-extrabold tracking-tight font-display ${isDark ? 'text-gray-100' : 'text-[#1A1A2E]'}`}>
              Built for{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-cyan-400 to-violet-400' : 'from-indigo-600 to-teal-500'}`}>
                Results
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                ref={(el) => (statCardsRef.current[i] = el)}
                className={`group rounded-2xl p-8 text-center border transition-all duration-500 hover:-translate-y-2 ${
                  isDark
                    ? 'bg-dark-card border-dark-border/30 shadow-dark-card hover:shadow-dark-elevated hover:border-cyan-400/20'
                    : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.12)] border-slate-100 hover:border-indigo-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  isDark ? 'bg-cyan-400/10 text-cyan-400' : 'bg-indigo-50 text-indigo-500'
                }`}>
                  <stat.Icon className="w-6 h-6" />
                </div>
                <div className={`text-5xl font-extrabold tracking-tight mb-2 font-display ${isDark ? 'text-gray-100' : 'text-[#1A1A2E]'}`}>
                  {statsVisible ? (
                    <CountUp end={stat.end} duration={2.5} suffix={stat.suffix} />
                  ) : (
                    <span>0{stat.suffix}</span>
                  )}
                </div>
                <div className={`text-xs font-bold uppercase tracking-[0.15em] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COURSE SHOWCASE ═══ */}
      <section ref={coursesRef} className={`py-32 relative overflow-hidden ${isDark ? 'bg-dark-bg' : 'bg-[#FAFAF8]'}`}>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? '#22D3EE' : '#6366f1'} 0.8px, transparent 0.8px)`,
          backgroundSize: '24px 24px',
        }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className={`font-bold text-xs tracking-[0.2em] uppercase mb-4 block ${isDark ? 'text-cyan-400' : 'text-indigo-500'}`}>
                Curriculum
              </span>
              <h2 className={`text-4xl md:text-6xl font-extrabold tracking-tight font-display ${isDark ? 'text-gray-100' : 'text-[#1A1A2E]'}`}>
                Explore{" "}
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-cyan-400 to-violet-400' : 'from-indigo-600 to-teal-500'}`}>
                  Courses
                </span>
              </h2>
            </div>
            <Link to="/courses" className={`text-sm font-bold transition-colors flex items-center gap-2 group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-500 hover:text-indigo-700'}`}>
              View All <span className="group-hover:translate-x-1 transition-transform">-></span>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1200px" }}>
            {loading ? (
              [0, 1, 2].map((i) => (
                <div key={i} className={`rounded-2xl h-72 animate-pulse shadow-sm border ${
                  isDark ? 'bg-dark-card border-dark-border/30' : 'bg-white border-slate-100'
                }`} />
              ))
            ) : featuredModules.length > 0 ? (
              featuredModules.map((module, idx) => (
                <Link
                  key={module._id}
                  to={`/modules/${module._id}`}
                  ref={(el) => (courseCardsRef.current[idx] = el)}
                  className="group block"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className={`rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-3 ${
                    isDark
                      ? 'bg-dark-card shadow-dark-card hover:shadow-dark-elevated border-dark-border/30 hover:border-cyan-400/20'
                      : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(79,70,229,0.15)] border-slate-100 hover:border-indigo-200'
                  }`}>
                    <div className={`h-2 bg-gradient-to-r ${courseColors[idx % 3]}`} />
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${
                          isDark ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }`}>
                          Module
                        </span>
                        <div className={`h-px flex-1 ${isDark ? 'bg-dark-border' : 'bg-slate-100'}`} />
                        <div className="w-10 h-10 relative">
                          <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={ringStroke} strokeWidth="3" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                              stroke={isDark ? (idx % 2 === 0 ? "#22D3EE" : "#A78BFA") : (idx % 2 === 0 ? "#6366f1" : "#14b8a6")}
                              strokeWidth="3" strokeDasharray={`${30 + idx * 20}, 100`} strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>

                      <h3 className={`text-xl font-bold mb-3 leading-snug transition-colors line-clamp-2 ${
                        isDark ? 'text-gray-100 group-hover:text-cyan-400' : 'text-[#1A1A2E] group-hover:text-indigo-600'
                      }`}>
                        {module.title}
                      </h3>
                      <p className={`text-sm leading-relaxed mb-6 line-clamp-3 ${isDark ? 'text-gray-500' : 'text-[#6B7280]'}`}>
                        {module.description}
                      </p>

                      <div className={`pt-5 border-t flex items-center justify-between ${isDark ? 'border-dark-border' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shadow-sm ${
                            isDark ? 'from-cyan-400 to-violet-400' : 'from-indigo-500 to-teal-500'
                          }`}>
                            {module.contributor?.name?.[0] || "M"}
                          </div>
                          <span className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                            {module.contributor?.name || "Expert"}
                          </span>
                        </div>
                        <span className={`text-xs font-bold group-hover:translate-x-1 transition-transform ${isDark ? 'text-cyan-400' : 'text-indigo-500'}`}>
                          Explore ->
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className={`col-span-full py-20 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center ${
                isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-slate-200'
              }`}>
                <BookOpen className={`w-12 h-12 mb-4 opacity-30 ${isDark ? 'text-gray-600' : 'text-slate-400'}`} />
                <p className={`font-bold mb-1 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>No modules available yet</p>
                <p className={`text-sm ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>Check back soon for new courses.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ LEARNING JOURNEY TIMELINE ═══ */}
      <section ref={timelineRef} className={`py-32 relative overflow-hidden ${isDark ? 'bg-dark-surface' : 'bg-white'}`}>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className={`font-bold text-xs tracking-[0.2em] uppercase mb-4 block ${isDark ? 'text-cyan-400' : 'text-indigo-500'}`}>
              Your Path
            </span>
            <h2 className={`text-4xl md:text-6xl font-extrabold tracking-tight font-display ${isDark ? 'text-gray-100' : 'text-[#1A1A2E]'}`}>
              The Learning{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-cyan-400 to-violet-400' : 'from-indigo-600 to-teal-500'}`}>
                Journey
              </span>
            </h2>
          </div>

          <div className="relative">
            <div className={`absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b hidden md:block ${
              isDark ? 'from-cyan-400 via-violet-400 to-cyan-400' : 'from-indigo-500 via-indigo-400 to-teal-500'
            }`} />

            {timelineSteps.map((step, i) => (
              <div
                key={step.step}
                ref={(el) => (timelineNodesRef.current[i] = el)}
                className={`flex items-center gap-8 mb-16 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className={`rounded-2xl p-8 border transition-all duration-500 inline-block max-w-md ${
                    isDark
                      ? 'bg-dark-card shadow-dark-card hover:shadow-dark-elevated border-dark-border/30 hover:border-cyan-400/20'
                      : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-slate-100 hover:shadow-[0_12px_40px_rgba(79,70,229,0.1)] hover:border-indigo-200'
                  }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                      isDark ? 'bg-cyan-400/10 text-cyan-400' : 'bg-indigo-50 text-indigo-500'
                    }`}>
                      <step.Icon className="w-5 h-5" />
                    </div>
                    <div className={`text-xs font-bold tracking-[0.2em] mb-2 ${isDark ? 'text-cyan-400' : 'text-indigo-500'}`}>
                      STEP {step.step}
                    </div>
                    <h3 className={`text-2xl font-extrabold mb-3 font-display ${isDark ? 'text-gray-100' : 'text-[#1A1A2E]'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#6B7280]'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className={`hidden md:flex items-center justify-center w-14 h-14 rounded-full text-white text-sm font-extrabold shadow-lg shrink-0 z-10 bg-gradient-to-br ${
                  isDark ? 'from-cyan-400 to-violet-400 shadow-cyan-500/20' : 'from-indigo-500 to-teal-500 shadow-indigo-500/20'
                }`}>
                  {step.step}
                </div>

                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section ref={testimonialsRef} className={`py-32 relative overflow-hidden ${isDark ? 'bg-dark-bg' : 'bg-[#F5F5F0]'}`}>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className={`font-bold text-xs tracking-[0.2em] uppercase mb-4 block ${isDark ? 'text-violet-400' : 'text-teal-500'}`}>
              Community
            </span>
            <h2 className={`text-4xl md:text-6xl font-extrabold tracking-tight font-display ${isDark ? 'text-gray-100' : 'text-[#1A1A2E]'}`}>
              What Our Learners{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-cyan-400 to-violet-400' : 'from-indigo-600 to-teal-500'}`}>
                Say
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                ref={(el) => (testimonialCardsRef.current[i] = el)}
                className={`rounded-2xl p-8 border transition-all duration-500 hover:-translate-y-2 ${i === 1 ? "md:-translate-y-4" : ""} ${
                  isDark
                    ? 'bg-dark-card shadow-dark-card hover:shadow-dark-elevated border-dark-border/30 hover:border-violet-400/20'
                    : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-slate-100 hover:shadow-[0_12px_40px_rgba(79,70,229,0.1)] hover:border-indigo-200'
                }`}
              >
                <div className={`text-6xl font-serif leading-none mb-4 ${isDark ? 'text-cyan-400/20' : 'text-indigo-100'}`}>"</div>
                <p className={`leading-relaxed mb-8 text-sm ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                  {t.quote}
                </p>

                <div className={`flex items-center gap-4 pt-6 border-t ${isDark ? 'border-dark-border' : 'border-slate-100'}`}>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shadow-sm ${
                    isDark ? 'from-cyan-400 to-violet-400' : 'from-indigo-500 to-teal-500'
                  }`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-[#1A1A2E]'}`}>{t.name}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section ref={ctaRef} className="py-32 relative overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-dark-card via-dark-bg to-dark-surface" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/10 blur-[100px] rounded-full" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#EEF2FF] via-white to-[#F0FDFA]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100/20 blur-[100px] rounded-full" />
          </>
        )}

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className={`text-4xl md:text-7xl font-extrabold tracking-tight mb-8 font-display leading-tight ${isDark ? 'text-gray-100' : 'text-[#1A1A2E]'}`}>
            Ready to Start Your
            <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-cyan-400 via-cyan-300 to-violet-400' : 'from-indigo-600 via-indigo-500 to-teal-500'}`}>
              Trading Journey?
            </span>
          </h2>
          <p className={`text-lg mb-12 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
            Join thousands of learners mastering the markets with expert guidance
            and structured education.
          </p>

          <Link
            to="/register"
            className={`inline-flex items-center gap-3 px-12 py-5 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg ${
              isDark
                ? 'bg-cyan-400 text-dark-bg shadow-cyan-500/25 hover:bg-cyan-300 hover:shadow-cyan-500/30'
                : 'bg-indigo-600 text-white shadow-indigo-500/25 hover:shadow-indigo-500/30'
            }`}
          >
            Get Started Free <span className="text-xl">-></span>
          </Link>

          <div className="flex flex-wrap justify-center gap-10 mt-16">
            {[
              { text: "Free to Start" },
              { text: "Expert-Led Courses" },
              { text: "Self-Paced Learning" },
            ].map((b) => (
              <div key={b.text} className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDark ? 'bg-cyan-400/10 text-cyan-400' : 'bg-teal-100 text-teal-600'
                }`}>
                  ok
                </span>
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
