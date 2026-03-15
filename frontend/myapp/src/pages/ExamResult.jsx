// src/pages/ExamResult.jsx — Light Theme
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

function ExamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  useEffect(() => { if (!result) navigate("/exams"); }, [result, navigate]);
  if (!result) return null;

  const { score, passed, passingScore, correctAnswers, totalQuestions, message } = result;

  return (
    <div className="min-h-screen bg-surface py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="card p-12 text-center overflow-hidden relative">
          <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${passed ? 'from-success to-teal-500' : 'from-danger to-orange-500'}`}></div>

          {/* Icon */}
          <div className="mb-8">
            <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center border-2 ${passed ? 'bg-success-light border-success/30' : 'bg-danger-light border-danger/30'}`}>
              {passed ? (
                <svg className="w-14 h-14 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-14 h-14 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </div>
          </div>

          {/* Message */}
          <span className={`text-xs font-bold uppercase tracking-wider mb-3 block ${passed ? 'text-success' : 'text-danger'}`}>{passed ? 'Exam Passed' : 'Exam Failed'}</span>
          <h1 className="text-4xl font-extrabold text-slate-heading mb-4 tracking-tight font-display">{passed ? "Congratulations! 🎉" : "Keep Practicing"}</h1>
          <p className="text-lg text-slate-body max-w-xl mx-auto leading-relaxed">{message || (passed ? "You have successfully passed! Your Contributor status has been unlocked." : "You didn't meet the passing criteria. Review the material and try again.")}</p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 my-8">
            <div className="bg-surface-subtle p-5 rounded-xl"><div className="text-xs text-slate-muted mb-1">Your Score</div><div className={`text-3xl font-bold ${passed ? 'text-success' : 'text-danger'}`}>{score}<span className="text-lg opacity-60">%</span></div></div>
            <div className="bg-surface-subtle p-5 rounded-xl"><div className="text-xs text-slate-muted mb-1">Required</div><div className="text-3xl font-bold text-slate-heading">{passingScore}<span className="text-lg opacity-60">%</span></div></div>
            <div className="bg-surface-subtle p-5 rounded-xl"><div className="text-xs text-slate-muted mb-1">Correct</div><div className="text-3xl font-bold text-slate-heading">{correctAnswers}<span className="text-lg opacity-60">/{totalQuestions}</span></div></div>
          </div>

          {/* Progress */}
          <div className="mb-8 px-4">
            <div className="flex justify-between text-xs text-slate-muted mb-2"><span>0%</span><span className="font-bold">{score}%</span><span>100%</span></div>
            <div className="w-full bg-surface-subtle rounded-full h-3 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${passed ? 'bg-gradient-to-r from-success to-teal-500' : 'bg-danger'}`} style={{ width: `${score}%` }}></div>
            </div>
          </div>

          {/* Context */}
          {passed ? (
            <div className="bg-success-light border border-success/20 rounded-xl p-5 mb-8 text-left">
              <h3 className="font-bold text-success-dark mb-1 text-sm">🎉 Contributor Status Unlocked</h3>
              <p className="text-sm text-slate-body">You can now create and publish courses on MarketMakers.</p>
            </div>
          ) : (
            <div className="bg-surface-subtle border border-slate-border/40 rounded-xl p-5 mb-8 text-left">
              <h3 className="font-bold text-slate-heading mb-2 text-sm">📋 Next Steps</h3>
              <ul className="text-sm text-slate-body space-y-1 list-disc list-inside">
                <li>Review the course materials</li>
                <li>Practice key concepts</li>
                <li>Retake the exam when ready</li>
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/exams" className="btn-outline flex-1 py-3">Back to Exams</Link>
            <Link to={passed ? "/dashboard" : "/courses"} className="btn-primary flex-1 py-3">{passed ? "Go to Dashboard" : "Review Courses"}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamResult;
