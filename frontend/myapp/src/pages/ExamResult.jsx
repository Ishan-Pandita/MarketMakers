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
        <div className="min-h-screen bg-[#050505] py-24 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className={`absolute top-0 right-1/4 w-[600px] h-[600px] blur-[120px] rounded-full -translate-y-1/2 opacity-20 ${passed ? 'bg-neon-green' : 'bg-red-500'}`}></div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="glass-dark rounded-[40px] border-white/5 p-16 text-center overflow-hidden relative group">
                    <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${passed ? 'from-neon-green to-blue-500' : 'from-red-500 to-orange-500'}`}></div>

                    {/* Result Icon - Cybernetic Style */}
                    <div className="mb-10 relative">
                        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center relative z-10 border-2 transition-all duration-700 ${passed ? 'bg-neon-green/10 border-neon-green shadow-[0_0_40px_#00ff6633]' : 'bg-red-500/10 border-red-500 shadow-[0_0_40px_#ef444433]'}`}>
                            {passed ? (
                                <svg className="w-16 h-16 text-neon-green animate-bounceIn" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-16 h-16 text-red-500 animate-shake" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        {/* Circular Particles */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed animate-spin-slow opacity-20 ${passed ? 'border-neon-green' : 'border-red-500'}`}></div>
                    </div>

                    {/* Result Message - High Impact */}
                    <div className="mb-12 animate-slideIn">
                        <span className={`text-[10px] font-black tracking-[0.4em] uppercase mb-4 block ${passed ? 'text-neon-green' : 'text-red-500'}`}>
                            {passed ? 'Exam Passed' : 'Exam Failed'}
                        </span>
                        <h1 className="text-6xl font-black text-white mb-6 tracking-tight leading-none">
                            {passed ? "Congratulations!" : "Keep <span className='text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500'>Practicing.</span>"}
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed italic">
                            {message || (passed ? "You have successfully passed the exam. You are now a Contributor." : "You did not meet the passing criteria. Please review the material and try again.")}
                        </p>
                    </div>

                    {/* Stats Bento Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slideIn" style={{ animationDelay: '100ms' }}>
                        <div className="bg-black/40 p-8 rounded-[32px] border border-white/5 group hover:border-white/10 transition-all">
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Final Score</div>
                            <div className={`text-4xl font-black ${passed ? 'text-neon-green' : 'text-red-500'}`}>{score}<span className="text-xl opacity-50">%</span></div>
                        </div>
                        <div className="bg-black/40 p-8 rounded-[32px] border border-white/5 group hover:border-white/10 transition-all">
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Passing Score</div>
                            <div className="text-4xl font-black text-white">{passingScore}<span className="text-xl opacity-50">%</span></div>
                        </div>
                        <div className="bg-black/40 p-8 rounded-[32px] border border-white/5 group hover:border-white/10 transition-all">
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Correct Answers</div>
                            <div className="text-4xl font-black text-white">{correctAnswers}<span className="text-xl opacity-50">/{totalQuestions}</span></div>
                        </div>
                    </div>

                    {/* Progress Indicator - Neon Track */}
                    <div className="mb-16 px-4 animate-slideIn" style={{ animationDelay: '200ms' }}>
                        <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                            <span>0% Threshold</span>
                            <span className={passed ? 'text-neon-green' : 'text-red-500'}>Score: {score}%</span>
                            <span>100% Target</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-3 p-1 border border-white/5">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${passed ? 'bg-gradient-to-r from-neon-green to-blue-500 shadow-[0_0_15px_#00ff6666]' : 'bg-red-500 shadow-[0_0_15px_#ef444466]'}`}
                                style={{ width: `${score}%` }}
                            >
                                <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full translate-x-1/2 -translate-y-1/2 blur-[2px]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Context Alerts */}
                    <div className="animate-slideIn" style={{ animationDelay: '300ms' }}>
                        {passed ? (
                            <div className="bg-neon-green/5 border border-neon-green/20 rounded-3xl p-8 mb-10 text-left relative overflow-hidden group">
                                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-neon-green/10 blur-3xl group-hover:bg-neon-green/20"></div>
                                <h3 className="font-black text-white mb-3 flex items-center gap-3 tracking-tight">
                                    <span className="text-neon-green text-xl font-mono">»</span> CONTRIBUTOR STATUS UNLOCKED
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    You are now authorized to create and publish courses on Market Makers.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 text-left relative overflow-hidden group">
                                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 blur-3xl group-hover:bg-white/10"></div>
                                <h3 className="font-black text-white mb-3 flex items-center gap-3 tracking-tight">
                                    <span className="text-neon-purple text-xl font-mono">»</span> NEXT STEPS
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <ul className="text-gray-400 text-[10px] font-bold space-y-2 uppercase tracking-widest">
                                        <li>● Review Courses</li>
                                        <li>● Study Material</li>
                                    </ul>
                                    <ul className="text-gray-400 text-[10px] font-bold space-y-2 uppercase tracking-widest">
                                        <li>● Practice Concepts</li>
                                        <li>● Retake Exam</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Ports */}
                    <div className="flex flex-col sm:flex-row gap-6 animate-slideIn" style={{ animationDelay: '400ms' }}>
                        <Link to="/exams" className="flex-1 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white transition-all">
                            Return to Exams
                        </Link>
                        <Link
                            to={passed ? "/dashboard" : "/modules"}
                            className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all ${passed ? 'bg-neon-green text-black shadow-[0_0_25px_#00ff6666]' : 'bg-neon-purple text-white shadow-[0_0_25px_#8b5cf666]'}`}
                        >
                            {passed ? "Go to Dashboard" : "Back to Courses"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExamResult;
