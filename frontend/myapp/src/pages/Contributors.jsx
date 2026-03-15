// src/pages/Contributors.jsx — Light Theme
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function Contributors() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchContributors(); }, []);
  const fetchContributors = async () => { try { setLoading(true); const res = await API.get("/users/contributors"); setContributors(res.data); } catch (error) { console.error("Error fetching contributors:", error); } finally { setLoading(false); } };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-surface py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14 animate-slideIn">
          <span className="badge badge-info mb-4">Community</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-heading tracking-tight mb-4 font-display">Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">Experts</span></h1>
          <p className="text-slate-body max-w-2xl mx-auto text-lg">Learn from approved contributors who share their strategies and knowledge.</p>
        </div>

        {contributors.length === 0 ? (
          <div className="card py-16 text-center max-w-lg mx-auto">
            <div className="text-4xl mb-4 opacity-40">👤</div>
            <p className="text-slate-body text-lg mb-4">No contributors yet. Be the first!</p>
            <Link to="/register" className="btn-primary inline-block px-8 py-3 text-sm">Create Account</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributors.map((c) => (
              <Link key={c._id} to={`/profile/${c._id}`} className="card p-6 group hover:border-indigo-200 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl text-white font-bold group-hover:scale-105 transition-transform shadow-glow-indigo">{c.name.charAt(0).toUpperCase()}</div>
                <h3 className="text-lg font-bold text-slate-heading mb-1 group-hover:text-indigo-500 transition-colors">{c.name}</h3>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-muted mb-4">
                  <span className="badge badge-role text-[10px]">Contributor</span>
                  <span>•</span>
                  <span>Since {new Date(c.createdAt).getFullYear()}</span>
                </div>
                <div className="bg-surface-subtle rounded-xl p-3 text-left">
                  <p className="text-xs text-slate-muted mb-1">Expertise</p>
                  <p className="text-sm text-slate-body font-medium line-clamp-2">{c.contributorDetails?.experience || "General Trading"}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Contributors;
