// src/components/ProgressBar.jsx — Light Theme
function ProgressBar({ progress = 0, size = "md" }) {
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };
  const h = heights[size] || heights.md;

  return (
    <div className={`w-full bg-slate-border/40 rounded-full ${h} overflow-hidden`}>
      <div
        className={`bg-gradient-to-r from-indigo-500 to-teal-500 ${h} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;
