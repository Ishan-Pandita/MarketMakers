// src/components/SuccessMessage.jsx — Light Theme
function SuccessMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-success-light border border-success/20 text-success-dark px-4 py-3 rounded-xl text-sm font-medium animate-slideIn flex items-center gap-3">
      <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export default SuccessMessage;
