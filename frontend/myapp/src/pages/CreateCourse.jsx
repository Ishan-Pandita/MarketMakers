// src/pages/CreateCourse.jsx — Light Theme
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";

function CreateCourse() {
  const [formData, setFormData] = useState({ title: "", description: "", order: "1", thumbnail: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(""); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) { setError("Title and description are required"); return; }
    setLoading(true);
    try { await API.post("/courses", formData); setSuccess("Course created!"); setTimeout(() => navigate("/dashboard"), 1500); } catch (err) { setError(err.response?.data?.message || "Failed to create course"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface py-16 px-4">
      <div className="max-w-2xl mx-auto animate-slideIn">
        <div className="mb-8">
          <span className="badge badge-info mb-4">New Course</span>
          <h1 className="text-3xl font-extrabold text-slate-heading tracking-tight mb-2 font-display">Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">Course</span></h1>
          <p className="text-slate-body">Build your educational content for learners.</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}
            <div className="space-y-1.5"><label className="block text-xs font-semibold text-slate-body">Course Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g., Stock Market Masterclass" disabled={loading} /></div>
            <div className="space-y-1.5"><label className="block text-xs font-semibold text-slate-body">Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="input-field min-h-[100px] resize-none" placeholder="What will this course cover?" disabled={loading} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5"><label className="block text-xs font-semibold text-slate-body">Display Order</label><input type="number" name="order" value={formData.order} onChange={handleChange} className="input-field" min="1" disabled={loading} /></div>
              <div className="space-y-1.5"><label className="block text-xs font-semibold text-slate-body">Thumbnail URL <span className="text-slate-muted">(optional)</span></label><input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="input-field" placeholder="https://..." disabled={loading} /></div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">{loading ? "Creating..." : "Create Course"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;
