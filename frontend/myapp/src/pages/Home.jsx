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
    <div className="bg-[#050505] min-h-screen text-white selection:bg-neon-purple selection:text-white">
      {/* Hero Section - The Portal */}
      <section className="relative pt-32 pb-40 lg:pt-56 lg:pb-64 overflow-hidden">
        {/* Deep Field Ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-neon-purple/10 blur-[160px] rounded-full -translate-y-1/2 opacity-40 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-neon-green/5 blur-[140px] rounded-full translate-y-1/3 opacity-30 animate-pulse delay-700"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-3 py-2 px-5 rounded-full bg-background-elevated/40 backdrop-blur-xl border border-white/10 text-gray-400 text-[10px] font-black tracking-[0.4em] uppercase mb-12 animate-slideIn group cursor-pointer hover:border-neon-green/30 transition-all">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
              </span>
              UNFOLD THE <span className="text-neon-green group-hover:text-white transition-colors">ALPHA LAYER</span>
            </div>

            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white mb-10 leading-[0.9] animate-slideIn" style={{ animationDelay: '100ms' }}>
              MARKET<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-blue-500 to-neon-purple">MAKERS.</span>
            </h1>

            <p className="max-w-3xl text-xl md:text-2xl text-gray-500 font-bold leading-relaxed mb-16 animate-slideIn italic" style={{ animationDelay: '200ms' }}>
              "The network where institutional logic meets retail execution." <br className="hidden md:block" />
              <span className="text-gray-400 font-black not-italic mt-4 block uppercase tracking-widest text-xs">Authorize your financial future.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-8 animate-slideIn" style={{ animationDelay: '300ms' }}>
              {isAuthenticated ? (
                <Link
                  to="/modules"
                  className="px-12 py-6 bg-neon-green text-black text-xs font-black uppercase tracking-[0.5em] rounded-full shadow-[0_0_40px_rgba(0,255,102,0.3)] hover:shadow-[0_0_60px_rgba(0,255,102,0.5)] hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300"
                >
                  Enter Terminal
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-12 py-6 bg-neon-purple text-white text-xs font-black uppercase tracking-[0.5em] rounded-full shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="px-12 py-6 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.5em] rounded-full backdrop-blur-md hover:bg-white/10 hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Social Proof Nodes */}
            <div className="mt-32 w-full animate-slideIn" style={{ animationDelay: '400ms' }}>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-12">Authorized Node Entities</p>
              <div className="flex flex-wrap justify-center gap-x-16 gap-y-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                {['BINANCE', 'COINBASE', 'KRAKEN', 'BYBIT', 'OKX'].map(node => (
                  <span key={node} className="text-2xl font-black tracking-tighter hover:text-white transition-colors cursor-default">{node}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Grid - The Library */}
      <section className="py-32 border-t border-white/5 relative bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-neon-purple font-mono font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Latest_Modules</span>
              <h2 className="text-5xl font-black text-white tracking-tighter mb-6 leading-none">High-Frequency <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-green">Intelligence.</span></h2>
              <p className="text-gray-500 font-bold leading-relaxed px-6 border-l-2 border-neon-purple/30 italic">Explore the latest institutional-grade modules synthesized by our elite architects.</p>
            </div>
            <Link to="/modules" className="text-[10px] font-black uppercase tracking-[0.2em] text-white underline decoration-neon-purple underline-offset-8 hover:text-neon-purple transition-all mb-2">View All Modules</Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-2 border-neon-purple/20 border-t-neon-purple rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-neon-purple">SYNC</div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredModules.length > 0 ? (
                featuredModules.map((module, idx) => (
                  <Link key={module._id} to={`/modules/${module._id}`} className="group block h-full">
                    <div className="glass-dark rounded-[40px] border-white/5 h-full p-10 relative overflow-hidden flex flex-col transition-all duration-500 hover:border-white/10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] hover:-translate-y-2">
                      {/* Subtle Index Number */}
                      <div className="absolute top-8 right-8 text-8xl font-black text-white/[0.02] leading-none select-none group-hover:text-neon-purple transition-all">0{idx + 1}</div>

                      <div className="mb-10 w-20 h-20 bg-neon-purple/10 border border-neon-purple/20 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 relative z-10">
                        <span className="drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">⚡</span>
                      </div>

                      <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-4 mb-6">
                          <span className="text-[8px] font-black tracking-[0.3em] uppercase px-3 py-1.5 rounded-lg bg-neon-purple/10 border border-neon-purple/20 text-neon-purple group-hover:bg-neon-purple group-hover:text-black transition-all">Phase One</span>
                          <div className="h-px flex-1 bg-white/5 group-hover:bg-white/10 transition-all"></div>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-4 line-clamp-2 leading-tight tracking-tight group-hover:text-neon-green transition-colors">{module.title}</h3>
                        <p className="text-gray-500 text-sm font-bold leading-relaxed mb-10 line-clamp-3 italic opacity-80 group-hover:opacity-100 transition-opacity">"{module.description}"</p>
                      </div>

                      <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neon-purple to-blue-500 flex items-center justify-center text-[10px] font-black shadow-[0_5px_15px_rgba(139,92,246,0.3)]">
                            {module.contributor?.name?.[0] || "M"}
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{module.contributor?.name || "Architect"}</div>
                        </div>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Deploy →</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-20 bg-white/5 border border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-center">
                  <div className="text-4xl mb-6 opacity-30">📂</div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">No Modules Found</p>
                  <p className="text-gray-500 font-bold mt-2">Create new modules to populate the marketplace.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Stats Bento Grid - The Ecosystem */}
      <section className="py-40 bg-[#050505] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-neon-green font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Ecosystem_Metrics</span>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">Unrivaled <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-500">Scale.</span></h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Large Feature Card */}
            <div className="md:col-span-2 md:row-span-2 glass-dark rounded-[48px] border-white/5 p-16 relative overflow-hidden flex flex-col justify-end group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-neon-green/5 blur-[100px] -translate-x-1/4 translate-y-1/4 animate-pulse"></div>
              <div className="relative z-10">
                <div className="text-7xl mb-10 group-hover:scale-110 transition-transform duration-700 origin-left">👨‍🎓</div>
                <div className="text-6xl font-black text-white mb-4 tracking-tighter">1,000+</div>
                <div className="text-xs font-black text-neon-green uppercase tracking-[0.4em] mb-6">Active Operators</div>
                <p className="text-gray-400 font-bold leading-relaxed italic text-lg opacity-60">Synchronizing market intelligence across 40+ global execution zones 24/7/365.</p>
              </div>
            </div>

            {/* Small Bento - Success Rate */}
            <div className="glass-dark rounded-[40px] border-white/5 p-10 relative overflow-hidden flex flex-col justify-center text-center group">
              <div className="text-5xl font-black text-white mb-2 tracking-tighter group-hover:text-neon-purple transition-colors">94%</div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Fidelity</div>
            </div>

            {/* Small Bento - Modules */}
            <div className="glass-dark rounded-[40px] border-white/5 p-10 relative overflow-hidden flex flex-col justify-center text-center group">
              <div className="text-5xl font-black text-white mb-2 tracking-tighter group-hover:text-neon-green transition-colors">50+</div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Intelligence Nodes</div>
            </div>

            {/* Medium Bento - Mobile Link */}
            <div className="md:col-span-2 glass-dark rounded-[40px] border-white/5 p-12 relative overflow-hidden flex items-center justify-between group">
              <div className="relative z-10">
                <div className="text-3xl font-black text-white mb-2 tracking-tight">Institutional Latency</div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest">Millisecond precision execution</div>
              </div>
              <div className="text-6xl font-black text-white/[0.05] absolute right-8 bottom-4 select-none group-hover:text-neon-purple transition-all duration-700">LATENCY</div>
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-2xl group-hover:bg-neon-purple group-hover:text-black transition-all">🚀</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - The Final Sync */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0b] to-black opacity-100"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-[0.9]">READY TO <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-blue-500 to-neon-purple">SYNCHRONIZE?</span></h2>
          <p className="text-xl text-gray-500 font-bold mb-16 leading-relaxed italic max-w-2xl mx-auto">"Opportunities in the alpha layer are fleeting. Your execution begins now."</p>

          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center transition-transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-green to-neon-purple blur-2xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative px-12 py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.5em] rounded-full flex items-center gap-6">
              <span>Sign Up Now</span>
              <span className="text-xl">→</span>
            </div>
          </Link>
        </div>
      </section>
    </div>

  );
}

export default Home;
