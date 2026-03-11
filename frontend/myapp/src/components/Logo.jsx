// src/components/Logo.jsx - Market Makers Brand Identity
// Reusable logo component with SVG gradient lightning bolt

/**
 * Logo variants:
 * - "icon"        → Lightning bolt only
 * - "abbreviated" → Lightning bolt + "MM."
 * - "full"        → Lightning bolt + "MARKET MAKERS."
 * - "stacked"     → Lightning bolt + "MARKET" / "MAKERS." stacked
 */
function Logo({ variant = "abbreviated", size = "md", className = "", glowColor = "purple" }) {
  // Size presets
  const sizes = {
    xs: { bolt: 20, text: "text-lg", container: "w-8 h-8", gap: "gap-2" },
    sm: { bolt: 24, text: "text-xl", container: "w-10 h-10", gap: "gap-2" },
    md: { bolt: 28, text: "text-2xl", container: "w-12 h-12", gap: "gap-3" },
    lg: { bolt: 36, text: "text-3xl", container: "w-14 h-14", gap: "gap-4" },
    xl: { bolt: 48, text: "text-5xl", container: "w-20 h-20", gap: "gap-5" },
  };

  const s = sizes[size] || sizes.md;

  // Gradient IDs need to be unique per instance
  const gradientId = `mm-bolt-gradient-${size}-${variant}`;

  const glowStyles = {
    purple: "group-hover:bg-neon-purple/20 group-hover:border-neon-purple/40 shadow-[0_0_20px_rgba(139,92,246,0.15)]",
    green: "group-hover:bg-neon-green/20 group-hover:border-neon-green/40 shadow-[0_0_20px_rgba(0,255,102,0.15)]",
  };

  // SVG Lightning Bolt with gradient
  const LightningBolt = () => (
    <svg
      width={s.bolt}
      height={s.bolt}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_8px_rgba(139,92,246,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(0,255,102,0.8)] transition-all duration-500"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A00E0" />
          <stop offset="40%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#00D4AA" />
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

  // Icon only variant
  if (variant === "icon") {
    return (
      <div className={`group inline-flex items-center justify-center ${className}`}>
        <div className={`${s.container} bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center ${glowStyles[glowColor]} group-hover:scale-110 transition-all duration-500`}>
          <LightningBolt />
        </div>
      </div>
    );
  }

  // Stacked variant: MARKET / MAKERS.
  if (variant === "stacked") {
    return (
      <div className={`group inline-flex items-center ${s.gap} ${className}`}>
        <div className={`${s.container} bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center ${glowStyles[glowColor]} group-hover:scale-110 transition-all duration-500`}>
          <LightningBolt />
        </div>
        <div className="flex flex-col leading-none">
          <span className={`${s.text} font-black text-white tracking-tighter`}>
            MARKET
          </span>
          <span className={`${s.text} font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-blue-500 to-neon-green`}>
            MAKERS.
          </span>
        </div>
      </div>
    );
  }

  // Full variant: MARKET MAKERS.
  if (variant === "full") {
    return (
      <div className={`group inline-flex items-center ${s.gap} ${className}`}>
        <div className={`${s.container} bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center ${glowStyles[glowColor]} group-hover:scale-110 transition-all duration-500`}>
          <LightningBolt />
        </div>
        <span className={`${s.text} font-black text-white tracking-tighter`}>
          MARKET <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-blue-500 to-neon-green">MAKERS.</span>
        </span>
      </div>
    );
  }

  // Default: abbreviated "MM."
  return (
    <div className={`group inline-flex items-center ${s.gap} ${className}`}>
      <div className={`${s.container} bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center ${glowStyles[glowColor]} group-hover:scale-110 transition-all duration-500`}>
        <LightningBolt />
      </div>
      <span className={`${s.text} font-black text-white tracking-tighter`}>
        MM<span className="text-neon-green">.</span>
      </span>
    </div>
  );
}

export default Logo;
