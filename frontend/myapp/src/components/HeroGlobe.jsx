// src/components/HeroGlobe.jsx — CSS-based 3D animated globe with orbit rings
import { useEffect, useRef } from "react";

export default function HeroGlobe() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId;
    let rotation = 0;

    const animate = () => {
      rotation += 0.3;
      container.style.setProperty("--rotation", `${rotation}deg`);
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div ref={containerRef} className="hero-globe-container" style={{ "--rotation": "0deg" }}>
      {/* Ambient glow */}
      <div className="hero-globe-glow" />

      {/* Main globe */}
      <div className="hero-globe">
        {/* Globe surface with gradient */}
        <div className="hero-globe-surface" />

        {/* Latitude lines */}
        {[20, 40, 60, 80, 100, 120, 140, 160].map((deg) => (
          <div
            key={deg}
            className="hero-globe-lat"
            style={{ transform: `rotateX(${deg}deg)` }}
          />
        ))}

        {/* Longitude lines */}
        {[0, 30, 60, 90, 120, 150].map((deg) => (
          <div
            key={deg}
            className="hero-globe-lng"
            style={{ transform: `rotateY(${deg}deg)` }}
          />
        ))}
      </div>

      {/* Orbit rings */}
      <div className="hero-orbit hero-orbit-1" />
      <div className="hero-orbit hero-orbit-2" />
      <div className="hero-orbit hero-orbit-3" />

      {/* Orbiting data dots */}
      <div className="hero-orbit-dot hero-orbit-dot-1" />
      <div className="hero-orbit-dot hero-orbit-dot-2" />
      <div className="hero-orbit-dot hero-orbit-dot-3" />
      <div className="hero-orbit-dot hero-orbit-dot-4" />
    </div>
  );
}
