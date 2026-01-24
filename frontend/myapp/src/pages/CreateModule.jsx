import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { useAuth } from "../context/AuthContext";

function CreateModule() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        order: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { user } = useAuth();
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
        if (!formData.title || !formData.description || !formData.order) {
            setError("All fields are required");
            return;
        }

        setLoading(true);
        try {
            await API.post("/modules", formData);
            setSuccess("Module created successfully!");
            // Redirect to contributor's own profile to see the new module
            setTimeout(() => navigate(`/profile/${user.id}`), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create module");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Module</h1>
                    <p className="text-gray-600 mt-2">
                        Share your knowledge with the community
                    </p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <ErrorMessage message={error} />}
                        {success && <SuccessMessage message={success} />}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Module Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., Advanced Technical Analysis"
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
                                placeholder="What will learners achieve in this module?"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Order Sequence
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., 1"
                                min="1"
                                disabled={loading}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Position of this module in your curriculum
                            </p>
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
                                "Create Module"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateModule;
