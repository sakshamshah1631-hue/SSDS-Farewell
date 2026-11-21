import React, { useEffect, useRef } from 'react';

export const AtmosphericBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Lightweight starlight particle pool (40 particles, zero expensive shadowBlur)
    interface Star {
      x: number;
      y: number;
      radius: number;
      speed: number;
      color: string;
      baseAlpha: number;
    }

    const stars: Star[] = [];
    const colors = [
      'rgba(56, 189, 248, ',   // Sky cyan
      'rgba(125, 211, 252, ',  // Light cyan
      'rgba(254, 240, 138, ',  // Soft champagne gold
      'rgba(255, 255, 255, ',  // Starlight white
      'rgba(37, 99, 235, ',    // Sapphire
    ];

    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        speed: (Math.random() - 0.5) * 0.15,
        color: colors[i % colors.length],
        baseAlpha: Math.random() * 0.5 + 0.2,
      });
    }

    let tick = 0;

    const render = () => {
      tick += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Fast, hardware-accelerated drawing without heavy shadowBlur
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y += star.speed;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const alpha = star.baseAlpha + Math.sin(tick * 2 + i) * 0.25;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${Math.max(0.1, alpha)})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Deep Obsidian & Sapphire Radial Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-cyan-900/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] rounded-full bg-blue-900/15 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />

      {/* Subtle bokeh circles (Strictly Blue/Cyan/Champagne harmony - NO PURPLE) */}
      <div className="absolute top-[18%] left-[8%] w-28 h-28 rounded-full bg-cyan-400/10 blur-xl bokeh-orb-1" />
      <div className="absolute top-[28%] left-[14%] w-40 h-40 rounded-full bg-blue-600/10 blur-2xl bokeh-orb-2" />
      <div className="absolute top-[45%] right-[10%] w-44 h-44 rounded-full bg-sky-500/10 blur-2xl bokeh-orb-1" />
      <div className="absolute top-[58%] right-[16%] w-28 h-28 rounded-full bg-amber-400/10 blur-xl bokeh-orb-2" />

      {/* Subtle Luminous Light Curve (Hardware accelerated SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="neonCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#2563eb" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="neonGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M -100 250 C 350 450, 750 150, 1550 500"
          fill="none"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.8"
        />
        <path
          d="M -50 280 C 420 520, 820 180, 1500 560"
          fill="none"
          stroke="url(#neonGoldGrad)"
          strokeWidth="1"
        />
      </svg>

      {/* Lightweight Starlight Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};
