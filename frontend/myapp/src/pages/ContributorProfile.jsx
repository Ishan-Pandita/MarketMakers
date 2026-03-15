// src/pages/ContributorProfile.jsx — Light Theme
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function ContributorProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchProfile(); }, [id]);
  const fetchProfile = async () => { try { setLoading(true); const res = await API.get(`/users/contributors/${id}`); setProfile(res.data.profile); setCourses(res.data.courses || []); setModules(res.data.modules || []); } catch (err) { setError("Contributor not found"); } finally { setLoading(false); } };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;

  if (error || !profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-6">
      <div className="text-4xl mb-4 opacity-40">⚠️</div>
      <h2 className="text-2xl font-bold text-slate-heading mb-2">Profile Not Found</h2>
      <p className="text-slate-muted mb-6">{error}</p>
      <Link to="/community" className="btn-primary px-8 py-3 text-sm">Back to Community</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-teal-500 pt-12 pb-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 bg-white/20 backdrop-blur-sm border border-white/20 rounded-3xl flex items-center justify-center text-5xl font-bold text-white shadow-elevated">{profile.name.charAt(0).toUpperCase()}</div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 font-display">{profile.name}</h1>
            <p className="text-white/60 text-sm mb-4">{profile.role === "admin" ? "Platform Administrator" : "Expert Contributor"}</p>
            <div className="flex items-center justify-center md:justify-start gap-3 text-xs">
              <span className="bg-white/10 border border-white/10 text-white px-4 py-1.5 rounded-lg">{courses.length} Course{courses.length !== 1 ? "s" : ""}</span>
              <span className="bg-white/10 border border-white/10 text-white px-4 py-1.5 rounded-lg">{modules.length} Module{modules.length !== 1 ? "s" : ""}</span>
              <span className="bg-white/10 border border-white/10 text-white px-4 py-1.5 rounded-lg">Since {new Date(profile.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* About */}
          <div className="card p-6 h-fit">
            <h3 className="text-sm font-bold text-slate-heading mb-5 pb-3 border-b border-slate-border/40">About</h3>
            <div className="space-y-5">
              <div><p className="text-xs text-slate-muted mb-1">Experience</p><p className="text-sm text-slate-body font-medium">{profile.contributorDetails?.experience || "Not specified"}</p></div>
              <div><p className="text-xs text-slate-muted mb-1">Motivation</p><p className="text-sm text-slate-body italic">"{profile.contributorDetails?.reason || "Passionate about teaching!"}"</p></div>
            </div>
          </div>

          {/* Courses & Modules */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-heading">Courses</h2>
            {courses.length === 0 ? (
              <div className="card p-10 text-center border-dashed"><div className="text-4xl mb-3 opacity-40">📚</div><p className="text-slate-muted">{profile.name} hasn't created any courses yet.</p></div>
            ) : (
              <div className="space-y-3">
                {courses.map((c) => (
                  <Link key={c._id} to={`/course/${c._id}/modules`} className="card p-5 group hover:border-indigo-200 flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">📚</div>
                      <div className="min-w-0"><h3 className="font-bold text-slate-heading group-hover:text-indigo-500 transition-colors truncate">{c.title}</h3><p className="text-xs text-slate-muted line-clamp-1">{c.description}</p></div>
                    </div>
                    <span className="text-slate-light group-hover:text-indigo-500 font-bold ml-4 flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            )}

            {modules.length > 0 && (
              <div className="mt-8 space-y-4">
                <h2 className="text-xl font-bold text-slate-heading">Modules</h2>
                <div className="space-y-3">
                  {modules.map((m) => (
                    <Link key={m._id} to={`/module/${m._id}`} className="card p-5 group hover:border-teal-200 flex justify-between items-center">
                      <div className="min-w-0"><h3 className="font-bold text-slate-heading group-hover:text-teal-500 transition-colors">{m.title}</h3><p className="text-xs text-slate-muted line-clamp-1">{m.description}</p></div>
                      <span className="text-slate-light group-hover:text-teal-500 font-bold ml-4 flex-shrink-0">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContributorProfile;
