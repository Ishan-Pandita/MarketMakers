import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";

function CreateCourse() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        order: "1",
        thumbnail: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            setError("Title and description are required");
            return;
        }

        setLoading(true);
        try {
            const res = await API.post("/courses", formData);
            setSuccess("Course created successfully!");
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] py-24 px-4 relative overflow-hidden">
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

            <div className="max-w-2xl mx-auto relative z-10 animate-slideIn">
                <div className="mb-12">
                    <span className="text-neon-green font-mono font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Architect://New_Course</span>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-3">Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-500">Course.</span></h1>
                    <p className="text-gray-500 font-bold">Build your educational foundation for the network</p>
                </div>

                <div className="glass-dark p-10 rounded-[40px] border-white/5 shadow-[0_0_80px_#000000]">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && <ErrorMessage message={error} />}
                        {success && <SuccessMessage message={success} />}

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                Course Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-green/50 transition-all font-bold tracking-tight"
                                placeholder="e.g., Stock Market Masterclass"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-green/50 transition-all font-bold tracking-tight min-h-[120px] resize-none"
                                placeholder="What core concepts will this course cover?"
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-green/50 transition-all font-bold tracking-tight"
                                    min="1"
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                    Thumbnail URL <span className="text-gray-700">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-green/50 transition-all font-bold tracking-tight"
                                    placeholder="https://example.com/image.jpg"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 rounded-2xl bg-neon-green text-black text-[10px] font-black tracking-[0.4em] uppercase shadow-[0_0_30px_#00ff664d] hover:shadow-[0_0_50px_#00ff6680] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-4"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                    <span>Deploying...</span>
                                </>
                            ) : (
                                "Deploy Course"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateCourse;
