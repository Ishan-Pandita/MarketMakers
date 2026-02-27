import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
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
            // Redirect to dashboard after a short delay
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
                    <p className="text-gray-600 mt-2">
                        Build your educational foundation
                    </p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <ErrorMessage message={error} />}
                        {success && <SuccessMessage message={success} />}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., Stock Market Masterclass"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="input-field min-h-[120px]"
                                placeholder="What core concepts will this course cover?"
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="1"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thumbnail URL (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="https://example.com/image.jpg"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="small" />
                                    <span>Creating...</span>
                                </>
                            ) : (
                                "Create Course"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateCourse;
