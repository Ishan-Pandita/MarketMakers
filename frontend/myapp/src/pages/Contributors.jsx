import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function Contributors() {
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContributors();
    }, []);

    const fetchContributors = async () => {
        try {
            setLoading(true);
            const res = await API.get("/users/contributors");
            setContributors(res.data);
        } catch (error) {
            console.error("Error fetching contributors:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Meet Our Experts
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Learn directly from approved contributors who share their specialized
                        strategies and knowledge.
                    </p>
                </div>

                {contributors.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500 text-lg">
                            No active contributors yet. Be the first one!
                        </p>
                        <Link to="/register" className="btn-primary mt-4 inline-block">
                            Become a Contributor
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {contributors.map((contributor) => (
                            <Link
                                key={contributor._id}
                                to={`/profile/${contributor._id}`}
                                className="card group hover:-translate-y-1 transition-transform duration-300"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                                        {contributor.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {contributor.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                            Contributor
                                        </span>
                                        <span>•</span>
                                        <span>
                                            Since {new Date(contributor.createdAt).getFullYear()}
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-50 rounded-lg p-4 mb-4 text-left">
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                            Expertise
                                        </p>
                                        <p className="text-gray-700 text-sm line-clamp-2">
                                            {contributor.contributorDetails?.experience ||
                                                "General Trading"}
                                        </p>
                                    </div>
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
