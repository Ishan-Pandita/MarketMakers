import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

function ExamResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result;

    useEffect(() => {
        if (!result) {
            navigate("/exams");
        }
    }, [result, navigate]);

    if (!result) return null;

    const { score, passed, passingScore, correctAnswers, totalQuestions, message } =
        result;

    const percentage = (correctAnswers / totalQuestions) * 100;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="card text-center">
                    {/* Result Icon */}
                    <div className="mb-6">
                        {passed ? (
                            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-12 h-12 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        ) : (
                            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-12 h-12 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Result Message */}
                    <h1
                        className={`text-3xl font-bold mb-2 ${passed ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {passed ? "Congratulations! 🎉" : "Not Quite There Yet"}
                    </h1>
                    <p className="text-gray-600 mb-8">{message}</p>

                    {/* Score Display */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <div className="text-4xl font-bold text-gray-900">{score}%</div>
                            <div className="text-sm text-gray-600 mt-1">Your Score</div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <div className="text-4xl font-bold text-gray-900">
                                {passingScore}%
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Passing Score</div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <div className="text-4xl font-bold text-gray-900">
                                {correctAnswers}/{totalQuestions}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                Correct Answers
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>0%</span>
                            <span>Passing: {passingScore}%</span>
                            <span>100%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className={`h-4 rounded-full transition-all ${passed ? "bg-green-600" : "bg-red-600"
                                    }`}
                                style={{ width: `${score}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    {passed && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 text-left">
                            <h3 className="font-bold text-green-800 mb-2">
                                🎓 You're Now a Contributor!
                            </h3>
                            <p className="text-green-700 text-sm">
                                Your role has been automatically upgraded. You can now create and
                                manage educational content. Start contributing to help others learn!
                            </p>
                        </div>
                    )}

                    {!passed && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
                            <h3 className="font-bold text-blue-800 mb-2">
                                💡 Tips for Next Time
                            </h3>
                            <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
                                <li>Review the course materials thoroughly</li>
                                <li>Focus on areas where you struggled</li>
                                <li>Take notes while studying</li>
                                <li>You can retake the exam anytime</li>
                            </ul>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link to="/exams" className="btn-secondary flex-1">
                            Back to Exams
                        </Link>
                        <Link to="/modules" className="btn-primary flex-1">
                            {passed ? "Start Contributing" : "Review Lessons"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExamResult;
