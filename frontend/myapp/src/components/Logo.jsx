// src/components/Logo.jsx — MarketMakers Brand Identity (Light Theme)

function Logo({ variant = "abbreviated", size = "md", className = "" }) {
  const sizes = {
    xs: { bolt: 18, text: "text-lg", container: "w-8 h-8", gap: "gap-2" },
    sm: { bolt: 22, text: "text-xl", container: "w-9 h-9", gap: "gap-2" },
    md: { bolt: 26, text: "text-2xl", container: "w-11 h-11", gap: "gap-3" },
    lg: { bolt: 32, text: "text-3xl", container: "w-14 h-14", gap: "gap-3" },
    xl: { bolt: 44, text: "text-5xl", container: "w-18 h-18", gap: "gap-4" },
  };

  const s = sizes[size] || sizes.md;
  const gradientId = `mm-bolt-gradient-${size}-${variant}`;

  const LightningBolt = () => (
    <svg
      width={s.bolt}
      height={s.bolt}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm group-hover:drop-shadow-md transition-all duration-500"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5048E5" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <path
        d="M18.5 2L6 18h8.5l-1 12L26 14h-8.5l1-12z"
        fill={`url(#${gradientId})`}
        stroke={`url(#${gradientId})`}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === "icon") {
    return (
      <div className={`group inline-flex items-center justify-center ${className}`}>
        <div className={`${s.container} bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 group-hover:scale-105 transition-all duration-300`}>
          <LightningBolt />
        </div>
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={`group inline-flex items-center ${s.gap} ${className}`}>
        <div className={`${s.container} bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 group-hover:scale-105 transition-all duration-300`}>
          <LightningBolt />
        </div>
        <div className="flex flex-col leading-none">
          <span className={`${s.text} font-extrabold text-slate-heading tracking-tight`}>
            Market
          </span>
          <span className={`${s.text} font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500`}>
            Makers
          </span>
        </div>
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={`group inline-flex items-center ${s.gap} ${className}`}>
        <div className={`${s.container} bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 group-hover:scale-105 transition-all duration-300`}>
          <LightningBolt />
        </div>
        <span className={`${s.text} font-extrabold text-slate-heading tracking-tight`}>
          Market<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">Makers</span>
        </span>
      </div>
    );
  }

  // Default: abbreviated "MM"
  return (
    <div className={`group inline-flex items-center ${s.gap} ${className}`}>
      <div className={`${s.container} bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 group-hover:scale-105 transition-all duration-300`}>
        <LightningBolt />
      </div>
      <span className={`${s.text} font-extrabold text-slate-heading tracking-tight`}>
        MM<span className="text-indigo-500">.</span>
      </span>
    </div>
  );
}

export default Logo;
