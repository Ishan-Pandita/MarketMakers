// src/components/ProgressBar.jsx
const ProgressBar = ({ percentage, showLabel = true, size = "medium" }) => {
  const sizeClasses = {
    small: "h-2",
    medium: "h-3",
    large: "h-4",
  };

  const getColor = () => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full">
      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`${getColor()} transition-all duration-500 ease-out ${
            sizeClasses[size]
          } rounded-full`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-600 mt-1 text-right">
          {percentage}% complete
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
