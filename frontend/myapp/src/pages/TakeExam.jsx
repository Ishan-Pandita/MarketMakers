// src/pages/TakeExam.jsx — Light Theme
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

  useEffect(() => { fetchExam(); }, [id]);
  useEffect(() => {
    if (!examStarted || timeRemaining <= 0) return;
    const timer = setInterval(() => { setTimeRemaining((prev) => { if (prev <= 1) { handleSubmit(); return 0; } return prev - 1; }); }, 1000);
    return () => clearInterval(timer);
  }, [examStarted, timeRemaining]);

  const fetchExam = async () => { try { const { data } = await API.get(`/exams/${id}`); setExam(data); setTimeRemaining(data.duration * 60); } catch (err) { setError(err.response?.data?.message || "Failed to load exam"); } finally { setLoading(false); } };
  const startExam = () => setExamStarted(true);
  const handleAnswerSelect = (qi, ai) => setAnswers({ ...answers, [qi]: ai });
  const handleSubmit = async () => {
    if (!window.confirm("Are you sure you want to submit?")) return;
    setSubmitting(true);
    try { const formattedAnswers = Object.entries(answers).map(([qi, sa]) => ({ questionIndex: parseInt(qi), selectedAnswer: sa })); const { data } = await API.post(`/exams/${id}/attempt`, { answers: formattedAnswers }); navigate(`/exams/${id}/result`, { state: { result: data } }); } catch (err) { setError(err.response?.data?.message || "Failed to submit exam"); setSubmitting(false); }
  };
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const getAnsweredCount = () => Object.keys(answers).length;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-surface"><ErrorMessage message={error} /></div>;
  if (!exam) return <div className="min-h-screen flex items-center justify-center bg-surface"><ErrorMessage message="Exam not found" /></div>;

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="card p-10 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-teal-500"></div>
            <div className="mb-8">
              <span className="badge badge-info mb-4">Exam</span>
              <h1 className="text-3xl font-extrabold text-slate-heading mb-4 tracking-tight font-display">{exam.title}</h1>
              <p className="text-slate-body leading-relaxed border-l-2 border-indigo-200 pl-4">{exam.description}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-surface-subtle p-5 rounded-xl text-center"><div className="text-3xl font-bold text-slate-heading mb-1">{exam.questions.length}</div><div className="text-xs text-slate-muted">Questions</div></div>
              <div className="bg-surface-subtle p-5 rounded-xl text-center"><div className="text-3xl font-bold text-slate-heading mb-1">{exam.duration}m</div><div className="text-xs text-slate-muted">Duration</div></div>
              <div className="bg-surface-subtle p-5 rounded-xl text-center"><div className="text-3xl font-bold text-slate-heading mb-1">{exam.passingScore}%</div><div className="text-xs text-slate-muted">Passing Score</div></div>
            </div>
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5 mb-8">
              <h3 className="font-bold text-indigo-700 mb-3 text-sm">Instructions</h3>
              <ul className="space-y-2 text-sm text-slate-body">
                {[`Duration: ${exam.duration} minutes`, "Timer starts immediately", "Navigate between questions freely", "Auto-submit when time runs out", `Score ${exam.passingScore}% or higher to pass`].map((s, i) => (
                  <li key={i} className="flex items-center gap-2"><span className="w-5 h-5 bg-indigo-50 rounded-lg flex items-center justify-center text-[10px] font-bold text-indigo-500">{i + 1}</span>{s}</li>
                ))}
              </ul>
            </div>
            <button onClick={startExam} className="btn-primary w-full py-4 text-sm font-bold">Start Exam</button>
          </div>
        </div>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-surface py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Sticky Header */}
        <div className="card p-5 mb-6 sticky top-4 z-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">📝</div>
              <div><h2 className="font-bold text-slate-heading">{exam.title}</h2><p className="text-xs text-slate-muted">Question {currentQuestion + 1} of {exam.questions.length} • {getAnsweredCount()} answered</p></div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-muted">Time Left</div>
                <div className={`text-2xl font-bold font-mono ${timeRemaining < 300 ? "text-danger" : "text-indigo-500"}`}>{formatTime(timeRemaining)}</div>
              </div>
              <div className="w-14 h-14 relative hidden md:block">
                <svg className="w-full h-full transform -rotate-90"><circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-border/30" /><circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={150} strokeDashoffset={150 * (1 - timeRemaining / (exam.duration * 60))} className={`${timeRemaining < 300 ? "text-danger" : "text-indigo-500"} transition-all`} /></svg>
                <div className="absolute inset-0 flex items-center justify-center"><span className="text-[10px] font-bold text-slate-heading">{Math.floor((timeRemaining / (exam.duration * 60)) * 100)}%</span></div>
              </div>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid lg:grid-cols-4 gap-6 mb-6 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-1 card p-5 order-2 lg:order-1">
            <h3 className="text-xs font-semibold text-slate-muted uppercase tracking-wider mb-4 text-center">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((_, i) => (
                <button key={i} onClick={() => setCurrentQuestion(i)} className={`aspect-square flex items-center justify-center text-xs font-bold rounded-lg border transition-all ${i === currentQuestion ? "border-indigo-500 bg-indigo-500 text-white" : answers[i] !== undefined ? "border-success/30 bg-success-light text-success" : "border-slate-border bg-white text-slate-muted hover:border-indigo-200"}`}>{i + 1}</button>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-border/40 text-center">
              <div className="text-2xl font-bold text-slate-heading">{getAnsweredCount()}<span className="text-sm text-slate-muted"> / {exam.questions.length}</span></div>
              <p className="text-xs text-slate-muted">Answered</p>
            </div>
          </div>

          {/* Question */}
          <div className="lg:col-span-3 space-y-6 order-1 lg:order-2">
            <div className="card p-8">
              <div className="mb-6">
                <span className="text-xs font-bold text-indigo-500 mb-3 block">Question {String(currentQuestion + 1).padStart(2, '0')}</span>
                <h3 className="text-2xl font-bold text-slate-heading leading-tight">{question.question}</h3>
              </div>
              <div className="grid gap-3">
                {question.options.map((option, i) => (
                  <button key={i} onClick={() => handleAnswerSelect(currentQuestion, i)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[currentQuestion] === i ? "border-indigo-500 bg-indigo-50" : "border-slate-border/40 bg-white hover:border-indigo-200"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs transition-all ${answers[currentQuestion] === i ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-border text-slate-muted"}`}>{String.fromCharCode(65 + i)}</div>
                      <span className={`font-medium transition-colors ${answers[currentQuestion] === i ? "text-slate-heading" : "text-slate-body"}`}>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0} className="btn-outline px-6 py-3 text-sm disabled:opacity-30">← Previous</button>
              {currentQuestion < exam.questions.length - 1 ? (
                <button onClick={() => setCurrentQuestion(Math.min(exam.questions.length - 1, currentQuestion + 1))} className="btn-secondary px-6 py-3 text-sm">Next Question →</button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting} className="btn-primary px-8 py-3 text-sm">{submitting ? "Submitting..." : "Submit Exam"}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakeExam;
