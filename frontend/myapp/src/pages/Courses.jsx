import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await API.get("/courses");
            setCourses(res.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="large" text="Loading courses..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Courses</h1>
                    <p className="text-gray-600">Choose a course to start your learning journey</p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-bold text-gray-900">No courses available yet</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course._id} className="card hover:shadow-xl transition-all duration-200">
                                <div className="h-48 bg-primary-100 rounded-t-xl mb-4 flex items-center justify-center text-4xl">
                                    {course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-t-xl" /> : "🎓"}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                                    <Link
                                        to={`/course/${course._id}/modules`}
                                        className="block w-full btn-primary text-center py-2"
                                    >
                                        View Curriculum →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Courses;
