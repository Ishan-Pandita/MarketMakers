// src/components/ErrorMessage.jsx — Light Theme
function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-danger-light border border-danger/20 text-danger-dark px-4 py-3 rounded-xl text-sm font-medium animate-slideIn flex items-center gap-3">
      <svg className="w-5 h-5 text-danger flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export default ErrorMessage;
