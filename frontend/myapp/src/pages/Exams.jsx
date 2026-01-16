import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function Exams() {
    const [exams, setExams] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [examsRes, attemptsRes] = await Promise.all([
                API.get("/exams"),
                API.get("/exams/attempts/me"),
            ]);

            setExams(examsRes.data);
            setAttempts(attemptsRes.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load exams");
        } finally {
            setLoading(false);
        }
    };

    const getAttemptForExam = (examId) => {
        return attempts.filter((attempt) => attempt.examId._id === examId);
    };

    const getBestScore = (examId) => {
        const examAttempts = getAttemptForExam(examId);
        if (examAttempts.length === 0) return null;
        return Math.max(...examAttempts.map((a) => a.score));
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Certification Exams
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Pass the exam with 80% or higher to become a contributor
                    </p>
                </div>

                {error && <ErrorMessage message={error} />}

                {/* Available Exams */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Available Exams
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {exams.map((exam) => {
                            const bestScore = getBestScore(exam._id);
                            const examAttempts = getAttemptForExam(exam._id);
                            const passed = examAttempts.some((a) => a.passed);

                            return (
                                <div key={exam._id} className="card">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {exam.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {exam.questions.length} questions • {exam.duration}{" "}
                                                minutes
                                            </p>
                                        </div>
                                        {passed && (
                                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                                                ✓ Passed
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-700 mb-4">{exam.description}</p>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                                        <div>
                                            <div className="text-sm text-gray-600">
                                                Passing Score
                                            </div>
                                            <div className="text-2xl font-bold text-primary-600">
                                                {exam.passingScore}%
                                            </div>
                                        </div>
                                        {bestScore !== null && (
                                            <div className="text-right">
                                                <div className="text-sm text-gray-600">
                                                    Your Best Score
                                                </div>
                                                <div
                                                    className={`text-2xl font-bold ${bestScore >= exam.passingScore
                                                            ? "text-green-600"
                                                            : "text-orange-600"
                                                        }`}
                                                >
                                                    {bestScore}%
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <Link
                                            to={`/exams/${exam._id}/take`}
                                            className="btn-primary flex-1 text-center"
                                        >
                                            {examAttempts.length > 0 ? "Retake Exam" : "Take Exam"}
                                        </Link>
                                        {examAttempts.length > 0 && (
                                            <Link
                                                to={`/exams/${exam._id}/history`}
                                                className="btn-secondary"
                                            >
                                                View History
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Attempts */}
                {attempts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Recent Attempts
                        </h2>
                        <div className="card overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Exam
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Score
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Result
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {attempts.slice(0, 10).map((attempt) => (
                                        <tr key={attempt._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {attempt.examId.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {attempt.score}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${attempt.passed
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {attempt.passed ? "Passed" : "Failed"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(attempt.completedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Exams;
