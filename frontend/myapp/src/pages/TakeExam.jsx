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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-neon-purple/20 border-t-neon-purple rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-neon-purple font-black">MM</div>
                </div>
            </div>
        );
    }

    if (error) return <ErrorMessage message={error} />;
    if (!exam) return <ErrorMessage message="Exam not found" />;

    // Start screen
    if (!examStarted) {
        return (
            <div className="min-h-screen bg-[#050505] py-20 relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-neon-purple/5 blur-[120px] rounded-full -translate-y-1/2"></div>

                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="glass-dark rounded-[40px] border-white/5 p-12 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-blue-500 to-neon-green"></div>

                        <div className="mb-12">
                            <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[10px] font-black tracking-widest uppercase mb-6">
                                Pre-flight Checklist
                            </span>
                            <h1 className="text-5xl font-black text-white mb-6 tracking-tight">
                                {exam.title}
                            </h1>
                            <p className="text-xl text-gray-400 leading-relaxed border-l-4 border-neon-purple/30 pl-6 italic">
                                {exam.description}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <div className="p-8 bg-black/40 rounded-3xl border border-white/5 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 blur-2xl"></div>
                                <div className="text-4xl font-black text-white mb-2">{exam.questions.length}</div>
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Total Questions</div>
                            </div>
                            <div className="p-8 bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-neon-purple/5 blur-2xl"></div>
                                <div className="text-4xl font-black text-white mb-2">{exam.duration}m</div>
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Time Allocated</div>
                            </div>
                            <div className="p-8 bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-neon-green/5 blur-2xl"></div>
                                <div className="text-4xl font-black text-white mb-2">{exam.passingScore}%</div>
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Accuracy Reqd</div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 mb-12 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent"></div>
                            <h3 className="font-black text-white mb-6 uppercase tracking-[0.2em] text-sm relative z-10 flex items-center gap-2">
                                <span className="text-neon-purple">!</span> Operational Constraints
                            </h3>
                            <ul className="space-y-4 relative z-10">
                                {[
                                    `Session duration: ${exam.duration} minutes total.`,
                                    "The countdown starts immediately upon opening.",
                                    "Linear and non-linear navigation enabled.",
                                    "Auto-commit triggered at t-minus 0.",
                                    `Minimum ${exam.passingScore}% accuracy required for verified status.`
                                ].map((step, idx) => (
                                    <li key={idx} className="flex items-center gap-4 text-gray-400 text-sm">
                                        <span className="w-5 h-5 bg-black rounded-full border border-white/10 flex items-center justify-center text-[10px] text-neon-purple font-mono">0{idx + 1}</span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={startExam}
                            className="bg-neon-purple text-white w-full py-6 text-sm font-black uppercase tracking-[0.5em] rounded-2xl shadow-[0_0_30px_#8b5cf666] hover:shadow-[0_0_50px_#8b5cf699] hover:-translate-y-1 transition-all"
                        >
                            Start Assessment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Exam screen
    const question = exam.questions[currentQuestion];

    return (
        <div className="min-h-screen bg-[#050505] py-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent"></div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                {/* Header with timer - Sticky terminal style */}
                <div className="glass-dark rounded-[32px] border-white/5 p-8 mb-8 sticky top-4 z-50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl">🎯</div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">
                                    {exam.title}
                                </h2>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                                    Question {currentQuestion + 1} of {exam.questions.length} • {getAnsweredCount()} Answered
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Time Remaining</div>
                                <div
                                    className={`text-3xl font-black font-mono tracking-widest ${timeRemaining < 300 ? "text-red-500 drop-shadow-[0_0_10px_#ef4444]" : "text-neon-purple"
                                        }`}
                                >
                                    {formatTime(timeRemaining)}
                                </div>
                            </div>
                            <div className="w-[80px] h-[80px] relative hidden md:block">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r="36"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        className="text-white/5"
                                    />
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r="36"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        strokeDasharray={226}
                                        strokeDashoffset={226 * (1 - timeRemaining / (exam.duration * 60))}
                                        className={`${timeRemaining < 300 ? "text-red-500" : "text-neon-purple"} transition-all duration-1000`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[10px] font-black text-white">{Math.floor((timeRemaining / (exam.duration * 60)) * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && <ErrorMessage message={error} />}

                {/* Main Content Area: Bento Layout */}
                <div className="grid lg:grid-cols-4 gap-8 mb-8 items-start">
                    {/* Progress Sidebar */}
                    <div className="lg:col-span-1 glass-dark rounded-[32px] border-white/5 p-8 order-2 lg:order-1">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8 text-center underline decoration-neon-purple underline-offset-8">Data Points</h3>
                        <div className="grid grid-cols-5 gap-3">
                            {exam.questions.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentQuestion(index)}
                                    className={`aspect-square flex items-center justify-center text-[10px] font-black rounded-lg border transition-all ${index === currentQuestion
                                        ? "border-neon-purple bg-neon-purple text-black shadow-[0_0_15px_#8b5cf666]"
                                        : answers[index] !== undefined
                                            ? "border-neon-green/30 bg-neon-green/10 text-neon-green"
                                            : "border-white/5 bg-white/5 text-gray-500 hover:border-white/20"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-white/5 text-center">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Progress Check</p>
                            <div className="text-2xl font-black text-white">{getAnsweredCount()}<span className="text-gray-500 text-sm"> / {exam.questions.length}</span></div>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="lg:col-span-3 space-y-8 order-1 lg:order-2">
                        <div className="glass-dark rounded-[40px] border-white/5 p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 blur-[80px] translate-x-1/2 -translate-y-1/2 transition-all group-hover:bg-neon-purple/10"></div>

                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-neon-purple font-mono font-black text-xs tracking-widest">QUESTION {currentQuestion + 1 < 10 ? `0${currentQuestion + 1}` : currentQuestion + 1}</span>
                                    <div className="h-px w-12 bg-white/20"></div>
                                </div>
                                <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                                    {question.question}
                                </h3>
                            </div>

                            <div className="grid gap-4">
                                {question.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(currentQuestion, index)}
                                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all relative group/opt overflow-hidden ${answers[currentQuestion] === index
                                            ? "border-neon-purple bg-neon-purple/5"
                                            : "border-white/5 bg-black/20 hover:border-white/20"
                                            }`}
                                    >
                                        <div className="flex items-center gap-6 relative z-10">
                                            <div
                                                className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-[10px] transition-all shadow-glow ${answers[currentQuestion] === index
                                                    ? "border-neon-purple bg-neon-purple text-black shadow-[0_0_15px_#8b5cf666]"
                                                    : "border-white/20 text-gray-500"
                                                    }`}
                                            >
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <span className={`text-lg font-bold transition-all ${answers[currentQuestion] === index ? "text-white" : "text-gray-400 group-hover/opt:text-white"}`}>
                                                {option}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Footer */}
                        <div className="flex items-center justify-between gap-6 px-4">
                            <button
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                ← Previous
                            </button>

                            {currentQuestion < exam.questions.length - 1 ? (
                                <button
                                    onClick={() =>
                                        setCurrentQuestion(
                                            Math.min(exam.questions.length - 1, currentQuestion + 1)
                                        )
                                    }
                                    className="px-8 py-4 bg-neon-purple/20 border border-neon-purple/40 text-neon-purple rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-neon-purple hover:text-black transition-all group"
                                >
                                    <span>Next Question</span>
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-10 py-4 bg-neon-green text-black rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_20px_#00ff664d] hover:shadow-[0_0_40px_#00ff6699] transition-all"
                                >
                                    {submitting ? "Processing..." : "Submit Exam"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TakeExam;
