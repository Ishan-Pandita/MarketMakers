import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { useAuth } from "../context/AuthContext";

function CreateModule() {
    const { courseId } = useParams();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        order: "",
        courseId: courseId || "",
    });
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const res = await API.get(`/courses/${courseId}`);
            setCourse(res.data);
        } catch (err) {
            console.error("Error fetching course:", err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.order) {
            setError("All fields are required");
            return;
        }

        setLoading(true);
        try {
            await API.post("/modules", { ...formData, courseId });
            setSuccess("Module created successfully!");
            setTimeout(() => navigate(`/course/${courseId}/modules`), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create module");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] py-24 px-4 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

            <div className="max-w-2xl mx-auto relative z-10 animate-slideIn">
                <div className="mb-12">
                    <span className="text-neon-purple font-mono font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Architect://Deploy_Module</span>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-3">
                        {course ? <>Add to <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-green">{course.title}</span></> : <>Create <span className="text-neon-purple">Module.</span></>}
                    </h1>
                    <p className="text-gray-500 font-bold">
                        {course ? "Expanding the curriculum" : "Share your knowledge with the network"}
                    </p>
                </div>

                <div className="glass-dark p-10 rounded-[40px] border-white/5 shadow-[0_0_80px_#000000]">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && <ErrorMessage message={error} />}
                        {success && <SuccessMessage message={success} />}

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                Module Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-bold tracking-tight"
                                placeholder="e.g., Advanced Technical Analysis"
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
                                className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-bold tracking-tight min-h-[120px] resize-none"
                                placeholder="What will learners achieve in this module?"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                Order Sequence
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:border-neon-purple/50 transition-all font-bold tracking-tight"
                                placeholder="e.g., 1"
                                min="1"
                                disabled={loading}
                            />
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest ml-1">
                                Position of this module in your curriculum
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 rounded-2xl bg-neon-purple text-white text-[10px] font-black tracking-[0.4em] uppercase shadow-[0_0_30px_#8b5cf64d] hover:shadow-[0_0_50px_#8b5cf680] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-4"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Deploying...</span>
                                </>
                            ) : (
                                "Deploy Module"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateModule;
