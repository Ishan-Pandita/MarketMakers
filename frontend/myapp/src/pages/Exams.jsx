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

    return (
        <div className="min-h-screen bg-[#050505] py-20 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-neon-purple/5 blur-[120px] rounded-full -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-16 animate-slideIn">
                    <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background-elevated/40 backdrop-blur-md border border-neon-purple/20 text-neon-purple text-xs font-bold mb-6 tracking-widest uppercase">
                        <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></span>
                        Assessment Mode
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Validate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-blue-500">Expertise.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                        Complete these specialized certifications to unlock Contributor privileges and validate your market knowledge.
                    </p>
                </div>

                {error && <ErrorMessage message={error} />}

                {/* Available Exams */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-px flex-1 bg-gradient-to-r from-neon-purple/50 to-transparent"></div>
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.4em]">Available Clearances</h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-neon-purple/50 to-transparent"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {exams.map((exam, idx) => {
                            const bestScore = getBestScore(exam._id);
                            const examAttempts = getAttemptForExam(exam._id);
                            const passed = examAttempts.some((a) => a.passed);

                            return (
                                <div
                                    key={exam._id}
                                    className="group glass-dark rounded-[32px] border-white/5 p-10 hover:border-neon-purple/40 transition-all duration-500 hover:shadow-[0_0_40px_#8b5cf61a] animate-slideIn relative overflow-hidden"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div>
                                            <h3 className="text-3xl font-black text-white group-hover:text-neon-purple transition-colors tracking-tight">
                                                {exam.title}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-3">
                                                <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase flex items-center gap-1">
                                                    <span className="text-neon-purple">●</span> {exam.questions.length} Questions
                                                </span>
                                                <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase flex items-center gap-1">
                                                    <span className="text-neon-purple">●</span> {exam.duration} Minutes
                                                </span>
                                            </div>
                                        </div>
                                        {passed && (
                                            <div className="bg-neon-green/10 text-neon-green border border-neon-green/30 px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase shadow-[0_0_15px_#00ff6633]">
                                                ✓ Verified
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-gray-400 mb-10 leading-relaxed italic border-l-2 border-white/10 pl-4">{exam.description || "Detailed scenario-based assessment for market proficiency."}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-10">
                                        <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                                            <div className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Passing Reqd</div>
                                            <div className="text-3xl font-black text-white">
                                                {exam.passingScore}<span className="text-neon-purple text-xl">%</span>
                                            </div>
                                        </div>
                                        {bestScore !== null && (
                                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 text-right">
                                                <div className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Max Accuracy</div>
                                                <div
                                                    className={`text-3xl font-black ${bestScore >= exam.passingScore
                                                        ? "text-neon-green"
                                                        : "text-orange-500"
                                                        }`}
                                                >
                                                    {bestScore}<span className="text-xl">%</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <Link
                                            to={`/exams/${exam._id}/take`}
                                            className="btn-primary flex-1 py-4 text-sm tracking-[0.2em] uppercase font-black rounded-2xl shadow-[0_0_20px_#00ff664d] hover:shadow-[0_0_30px_#00ff6680]"
                                        >
                                            {examAttempts.length > 0 ? "Retake Exam" : "Start Exam"}
                                        </Link>
                                        {examAttempts.length > 0 && (
                                            <Link
                                                to={`/exams/${exam._id}/history`}
                                                className="w-16 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
                                                title="View History"
                                            >
                                                <span className="text-xl">📜</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent History Table */}
                {attempts.length > 0 && (
                    <div className="animate-slideIn" style={{ animationDelay: '300ms' }}>
                        <div className="flex items-center gap-4 mb-10 text-center">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.4em] w-full text-center">Activity Logs</h2>
                        </div>
                        <div className="glass-dark rounded-[32px] border-white/5 overflow-hidden">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Exam</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Score</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Outcome</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {attempts.slice(0, 10).map((attempt) => (
                                        <tr key={attempt._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-bold text-white">
                                                    {attempt.examId.title}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-mono text-neon-purple font-black">
                                                    {attempt.score}%
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <span
                                                    className={`px-4 py-1.5 inline-flex text-[10px] font-black rounded-lg uppercase tracking-widest ${attempt.passed
                                                        ? "bg-neon-green/10 text-neon-green border border-neon-green/30 shadow-[0_0_10px_#00ff661a]"
                                                        : "bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_10px_#ef44441a]"
                                                        }`}
                                                >
                                                    {attempt.passed ? "Passed" : "Failed"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-xs text-gray-500 font-mono">
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
