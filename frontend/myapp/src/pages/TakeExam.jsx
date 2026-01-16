import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function TakeExam() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [examStarted, setExamStarted] = useState(false);

    useEffect(() => {
        fetchExam();
    }, [id]);

    useEffect(() => {
        if (!examStarted || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [examStarted, timeRemaining]);

    const fetchExam = async () => {
        try {
            const { data } = await API.get(`/exams/${id}`);
            setExam(data);
            setTimeRemaining(data.duration * 60); // Convert minutes to seconds
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load exam");
        } finally {
            setLoading(false);
        }
    };

    const startExam = () => {
        setExamStarted(true);
    };

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setAnswers({
            ...answers,
            [questionIndex]: answerIndex,
        });
    };

    const handleSubmit = async () => {
        if (!window.confirm("Are you sure you want to submit your exam?")) {
            return;
        }

        setSubmitting(true);

        try {
            // Format answers for API
            const formattedAnswers = Object.entries(answers).map(
                ([questionIndex, selectedAnswer]) => ({
                    questionIndex: parseInt(questionIndex),
                    selectedAnswer,
                })
            );

            const { data } = await API.post(`/exams/${id}/attempt`, {
                answers: formattedAnswers,
            });

            // Navigate to results page
            navigate(`/exams/${id}/result`, { state: { result: data } });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit exam");
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const getAnsweredCount = () => {
        return Object.keys(answers).length;
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!exam) return <ErrorMessage message="Exam not found" />;

    // Start screen
    if (!examStarted) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="card">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {exam.title}
                        </h1>
                        <p className="text-gray-700 mb-6">{exam.description}</p>

                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            <div className="p-4 bg-blue-50 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {exam.questions.length}
                                </div>
                                <div className="text-sm text-gray-600">Questions</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {exam.duration} min
                                </div>
                                <div className="text-sm text-gray-600">Duration</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {exam.passingScore}%
                                </div>
                                <div className="text-sm text-gray-600">Passing Score</div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <h3 className="font-bold text-yellow-800 mb-2">
                                Important Instructions:
                            </h3>
                            <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
                                <li>You have {exam.duration} minutes to complete the exam</li>
                                <li>The timer will start when you click "Start Exam"</li>
                                <li>You can navigate between questions freely</li>
                                <li>The exam will auto-submit when time runs out</li>
                                <li>
                                    You need {exam.passingScore}% to pass and become a contributor
                                </li>
                            </ul>
                        </div>

                        <button onClick={startExam} className="btn-primary w-full text-lg">
                            Start Exam →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Exam screen
    const question = exam.questions[currentQuestion];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header with timer */}
                <div className="card mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {exam.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                                Question {currentQuestion + 1} of {exam.questions.length} •{" "}
                                {getAnsweredCount()} answered
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-600">Time Remaining</div>
                            <div
                                className={`text-2xl font-bold ${timeRemaining < 300 ? "text-red-600" : "text-primary-600"
                                    }`}
                            >
                                {formatTime(timeRemaining)}
                            </div>
                        </div>
                    </div>
                </div>

                {error && <ErrorMessage message={error} />}

                {/* Question */}
                <div className="card mb-6">
                    <div className="mb-6">
                        <span className="text-sm font-semibold text-primary-600">
                            Question {currentQuestion + 1}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mt-2">
                            {question.question}
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(currentQuestion, index)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQuestion] === index
                                        ? "border-primary-600 bg-primary-50"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${answers[currentQuestion] === index
                                                ? "border-primary-600 bg-primary-600"
                                                : "border-gray-300"
                                            }`}
                                    >
                                        {answers[currentQuestion] === index && (
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-gray-900">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                            disabled={currentQuestion === 0}
                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </button>

                        <div className="text-sm text-gray-600">
                            {getAnsweredCount()} of {exam.questions.length} answered
                        </div>

                        {currentQuestion < exam.questions.length - 1 ? (
                            <button
                                onClick={() =>
                                    setCurrentQuestion(
                                        Math.min(exam.questions.length - 1, currentQuestion + 1)
                                    )
                                }
                                className="btn-secondary"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="btn-primary"
                            >
                                {submitting ? "Submitting..." : "Submit Exam"}
                            </button>
                        )}
                    </div>

                    {/* Question navigator */}
                    <div className="grid grid-cols-10 gap-2">
                        {exam.questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestion(index)}
                                className={`p-2 text-sm font-semibold rounded ${index === currentQuestion
                                        ? "bg-primary-600 text-white"
                                        : answers[index] !== undefined
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TakeExam;
