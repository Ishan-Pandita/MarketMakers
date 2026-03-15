// src/pages/Exams.jsx — Light Theme
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

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [examsRes, attemptsRes] = await Promise.all([API.get("/exams"), API.get("/exams/attempts/me")]);
      setExams(examsRes.data);
      setAttempts(attemptsRes.data);
    } catch (err) { setError(err.response?.data?.message || "Failed to load exams"); } finally { setLoading(false); }
  };

  const getAttemptForExam = (examId) => attempts.filter((a) => a.examId._id === examId);
  const getBestScore = (examId) => { const ea = getAttemptForExam(examId); if (ea.length === 0) return null; return Math.max(...ea.map((a) => a.score)); };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-surface py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 animate-slideIn">
          <span className="badge badge-info mb-4">Certifications</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-heading mb-4 tracking-tight font-display">
            Validate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">Expertise</span>
          </h1>
          <p className="text-lg text-slate-body max-w-2xl leading-relaxed">
            Complete these certification exams to earn credentials and validate your trading knowledge.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {exams.map((exam, idx) => {
            const bestScore = getBestScore(exam._id);
            const examAttempts = getAttemptForExam(exam._id);
            const passed = examAttempts.some((a) => a.passed);
            return (
              <div key={exam._id} className="card p-8 group animate-slideIn" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-heading group-hover:text-indigo-500 transition-colors tracking-tight">{exam.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs font-semibold text-slate-muted flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>{exam.questions.length} Questions</span>
                      <span className="text-xs font-semibold text-slate-muted flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>{exam.duration} Minutes</span>
                    </div>
                  </div>
                  {passed && <span className="badge badge-success">✓ Passed</span>}
                </div>

                <p className="text-slate-body text-sm mb-6 leading-relaxed border-l-2 border-indigo-200 pl-4">{exam.description || "Comprehensive assessment to validate your proficiency."}</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-surface-subtle p-4 rounded-xl">
                    <div className="text-xs text-slate-muted mb-1">Passing Score</div>
                    <div className="text-2xl font-bold text-slate-heading">{exam.passingScore}<span className="text-indigo-500 text-lg">%</span></div>
                  </div>
                  {bestScore !== null && (
                    <div className="bg-surface-subtle p-4 rounded-xl text-right">
                      <div className="text-xs text-slate-muted mb-1">Your Best</div>
                      <div className={`text-2xl font-bold ${bestScore >= exam.passingScore ? "text-success" : "text-warning"}`}>{bestScore}<span className="text-lg">%</span></div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link to={`/exams/${exam._id}/take`} className="btn-primary flex-1 py-3 text-sm text-center">
                    {examAttempts.length > 0 ? "Retake Exam" : "Start Exam"}
                  </Link>
                  {examAttempts.length > 0 && (
                    <Link to={`/exams/${exam._id}/history`} className="w-12 h-12 flex items-center justify-center bg-surface-subtle hover:bg-indigo-50 border border-slate-border rounded-xl transition-all" title="View History">📜</Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* History Table */}
        {attempts.length > 0 && (
          <div className="animate-slideIn">
            <h2 className="text-lg font-bold text-slate-heading mb-4">Exam History</h2>
            <div className="card overflow-hidden p-0">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-border/60 bg-surface-subtle">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-muted uppercase tracking-wider">Exam</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-muted uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-muted uppercase tracking-wider">Result</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-muted uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-border/40">
                  {attempts.slice(0, 10).map((attempt) => (
                    <tr key={attempt._id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="px-6 py-4"><div className="text-sm font-semibold text-slate-heading">{attempt.examId.title}</div></td>
                      <td className="px-6 py-4"><div className="text-sm font-bold text-indigo-500">{attempt.score}%</div></td>
                      <td className="px-6 py-4"><span className={`badge text-[10px] ${attempt.passed ? 'badge-success' : 'bg-danger-light text-danger-dark border border-danger/20'}`}>{attempt.passed ? "Passed" : "Failed"}</span></td>
                      <td className="px-6 py-4 text-sm text-slate-muted">{new Date(attempt.completedAt).toLocaleDateString()}</td>
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
