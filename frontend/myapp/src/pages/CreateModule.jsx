// src/pages/CreateModule.jsx — Light Theme
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { useAuth } from "../context/AuthContext";

function CreateModule() {
  const { courseId } = useParams();
  const [formData, setFormData] = useState({ title: "", description: "", order: "", courseId: courseId || "" });
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (courseId) fetchCourse(); }, [courseId]);
  const fetchCourse = async () => { try { const res = await API.get(`/courses/${courseId}`); setCourse(res.data); } catch (err) {} };
  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(""); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.order) { setError("All fields are required"); return; }
    setLoading(true);
    try { await API.post("/modules", { ...formData, courseId }); setSuccess("Module created!"); setTimeout(() => navigate(`/course/${courseId}/modules`), 1500); } catch (err) { setError(err.response?.data?.message || "Failed to create module"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface py-16 px-4">
      <div className="max-w-2xl mx-auto animate-slideIn">
        <div className="mb-8">
          <span className="badge badge-info mb-4">New Module</span>
          <h1 className="text-3xl font-extrabold text-slate-heading tracking-tight mb-2 font-display">
            {course ? <>Add to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">{course.title}</span></> : <>Create <span className="text-indigo-500">Module</span></>}
          </h1>
          <p className="text-slate-body">{course ? "Expand the course curriculum." : "Share your knowledge with learners."}</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}
            <div className="space-y-1.5"><label className="block text-xs font-semibold text-slate-body">Module Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g., Advanced Technical Analysis" disabled={loading} /></div>
            <div className="space-y-1.5"><label className="block text-xs font-semibold text-slate-body">Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="input-field min-h-[100px] resize-none" placeholder="What will learners achieve?" disabled={loading} /></div>
            <div className="space-y-1.5"><label className="block text-xs font-semibold text-slate-body">Order</label><input type="number" name="order" value={formData.order} onChange={handleChange} className="input-field" placeholder="1" min="1" disabled={loading} /><p className="text-xs text-slate-muted mt-1">Position in the course sequence</p></div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">{loading ? "Creating..." : "Create Module"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateModule;
