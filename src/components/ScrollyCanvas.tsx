import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollyCanvasProps {
  frameCount: number;
  framePrefix: string;    // e.g. "/frames/Candle_products_video_intro_5171c673-"
  frameExtension: string; // e.g. "jpg"
  /** Number of digits for zero-padding frame index (default: 4) */
  padLength?: number;
  /** vh multiplier for scroll length (e.g. 5 means 500vh of scroll distance) */
  scrollMultiplier?: number;
}

function padNum(n: number, len: number): string {
  return String(n).padStart(len, '0');
}

const ScrollyCanvas: React.FC<ScrollyCanvasProps> = ({
  frameCount,
  framePrefix,
  frameExtension,
  padLength = 4,
  scrollMultiplier = 6, // 6× viewport height for deliberate, cinema-quality scrubbing
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [overlayText, setOverlayText] = useState<string>('');

  // Subtle poetic captions timed with frame milestones
  const overlayMilestones: Array<{ start: number; end: number; text: string }> = [
    { start: 0,  end: 25,  text: 'Handcrafted with love.' },
    { start: 26, end: 55,  text: 'Scents that tell stories.' },
    { start: 56, end: 85,  text: 'Find your quiet glow.' },
    { start: 86, end: 101, text: 'The Sahyadri collection.' },
  ];

  // ── High-DPI Cover Draw function ──────────────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use high DPI buffer
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth || window.innerWidth;
    const displayHeight = canvas.clientHeight || window.innerHeight;

    if (canvas.width !== Math.round(displayWidth * dpr) || canvas.height !== Math.round(displayHeight * dpr)) {
      canvas.width = Math.round(displayWidth * dpr);
      canvas.height = Math.round(displayHeight * dpr);
    }

    // Cover calculation (object-fit: cover for canvas)
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const ox = (cw - nw) / 2;
    const oy = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, ox, oy, nw, nh);
    currentFrameRef.current = index;

    // Update overlay text milestone
    const milestone = overlayMilestones.find(m => index >= m.start && index <= m.end);
    setOverlayText(milestone?.text ?? '');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Resize handler ────────────────────────────────────────────────────────
  const handleResize = useCallback(() => {
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // ── Scroll handler (robust progress calculation) ──────────────────────────
  const handleScroll = useCallback(() => {
    const outer = outerRef.current;
    if (!outer || !allLoaded) return;

    const rect = outer.getBoundingClientRect();
    // Total distance the outer container travels while pinned
    const scrollableDistance = outer.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return;

    // How far the top of the container has scrolled past the top of the viewport
    const scrolled = -rect.top;
    const rawProgress = scrolled / scrollableDistance;
    const progress = Math.max(0, Math.min(1, rawProgress));

    const frameIndex = Math.min(Math.floor(progress * frameCount), frameCount - 1);

    if (frameIndex !== currentFrameRef.current) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    }
  }, [allLoaded, frameCount, drawFrame]);

  // ── Preload all frames ────────────────────────────────────────────────────
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${framePrefix}${padNum(i, padLength)}.${frameExtension}`;
      img.onload = () => {
        loaded += 1;
        setLoadedCount(loaded);
        if (loaded === frameCount) {
          setAllLoaded(true);
          // Draw first frame when all ready
          drawFrame(0);
        }
      };
      img.onerror = () => {
        loaded += 1;
        setLoadedCount(loaded);
        if (loaded === frameCount) setAllLoaded(true);
      };
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [frameCount, framePrefix, frameExtension, padLength, drawFrame]);

  // ── Attach scroll listener ────────────────────────────────────────────────
  useEffect(() => {
    if (!allLoaded) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allLoaded, handleScroll]);

  // ── Attach resize listener ────────────────────────────────────────────────
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const loadPercent = Math.round((loadedCount / frameCount) * 100);

  return (
    <div
      ref={outerRef}
      className="scrolly-outer"
      style={{ height: `${(scrollMultiplier + 1) * 100}vh` }}
      aria-label="Sahyadri Glow product intro animation"
    >
      {/* Loading overlay */}
      {!allLoaded && (
        <div className="scrolly-loader-overlay">
          <div className="scrolly-loader-inner">
            <p className="scrolly-loader-brand">Sahyadri Glow</p>
            <div className="scrolly-loader-bar-track">
              <div
                className="scrolly-loader-bar-fill"
                style={{ width: `${loadPercent}%` }}
              />
            </div>
            <p className="scrolly-loader-pct">{loadPercent}%</p>
          </div>
        </div>
      )}

      {/* Sticky canvas wrapper: pinned smoothly to viewport */}
      <div className="scrolly-canvas-wrap">
        <canvas ref={canvasRef} className="scrolly-canvas" />

        {/* Narrative text milestone */}
        {allLoaded && overlayText && (
          <div className="scrolly-overlay-text" key={overlayText}>
            <span>{overlayText}</span>
          </div>
        )}

        {/* Scroll cue hint */}
        {allLoaded && (
          <div className="scrolly-hint">
            <span>Scroll to explore</span>
            <span className="scrolly-hint-arrow">↓</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrollyCanvas;
