// src/components/LoadingSpinner.jsx — Light Theme
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="w-12 h-12 border-3 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
