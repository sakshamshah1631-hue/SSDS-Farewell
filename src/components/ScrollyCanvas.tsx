import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

export interface FrameConfig {
  frameCount: number;
  framePrefix: string;
  frameExtension: string;
  padLength?: number;
}

interface ScrollyCanvasProps {
  desktopConfig?: FrameConfig;
  mobileConfig?: FrameConfig;
  // Fallback direct props for backward compatibility
  frameCount?: number;
  framePrefix?: string;
  frameExtension?: string;
  padLength?: number;
  scrollMultiplier?: number;
  onExploreClick?: () => void;
}

function padNum(n: number, len: number): string {
  return String(n).padStart(len, '0');
}

const DEFAULT_DESKTOP: FrameConfig = {
  frameCount: 101,
  framePrefix: '/frames/Candle_products_video_intro_5171c673-',
  frameExtension: 'jpg',
  padLength: 4,
};

const DEFAULT_MOBILE: FrameConfig = {
  frameCount: 101,
  framePrefix: '/frames-mobile/Candle_website_intro_video_664012b1-',
  frameExtension: 'jpg',
  padLength: 4,
};

export const ScrollyCanvas: React.FC<ScrollyCanvasProps> = ({
  desktopConfig = DEFAULT_DESKTOP,
  mobileConfig = DEFAULT_MOBILE,
  frameCount: propCount,
  framePrefix: propPrefix,
  frameExtension: propExt,
  padLength: propPad,
  scrollMultiplier = 4,
  onExploreClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastDimensionsRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // Detect mobile device or vertical 9:16 screen ratio
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || window.innerHeight > window.innerWidth;
  });

  const activeConfig = useMemo(() => {
    // If specific props were passed directly and configs weren't overridden, use them
    if (propCount && propPrefix && propExt) {
      if (isMobile && mobileConfig) return mobileConfig;
      return {
        frameCount: propCount,
        framePrefix: propPrefix,
        frameExtension: propExt,
        padLength: propPad ?? 4,
      };
    }
    return isMobile ? mobileConfig : desktopConfig;
  }, [isMobile, mobileConfig, desktopConfig, propCount, propPrefix, propExt, propPad]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [hasStartedDrawing, setHasStartedDrawing] = useState(false);
  const [overlayText, setOverlayText] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Poetic captions timed with frame milestones
  const overlayMilestones: Array<{ start: number; end: number; text: string }> = [
    { start: 0, end: 25, text: 'Handcrafted with love.' },
    { start: 26, end: 55, text: 'Scents that tell stories.' },
    { start: 56, end: 82, text: 'Find your quiet glow.' },
    { start: 83, end: 101, text: 'The Sahyadri collection.' },
  ];

  // ── High-DPI Cover Draw function ──────────────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use High-DPI buffer up to 2x for retina sharpness without excessive memory
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth || window.innerWidth;
    const displayHeight = canvas.clientHeight || window.innerHeight;

    // Gracefully handle mobile address bar resizing: only resize canvas buffer
    // if width changes or if height change exceeds 75px (address bar threshold)
    const prev = lastDimensionsRef.current;
    const widthChanged = Math.abs(prev.w - displayWidth) > 2;
    const heightChanged = Math.abs(prev.h - displayHeight) > 75;

    if (
      canvas.width !== Math.round(displayWidth * dpr) ||
      canvas.height !== Math.round(displayHeight * dpr)
    ) {
      if (prev.w === 0 || widthChanged || heightChanged) {
        canvas.width = Math.round(displayWidth * dpr);
        canvas.height = Math.round(displayHeight * dpr);
        lastDimensionsRef.current = { w: displayWidth, h: displayHeight };
      }
    }

    // Cover math (object-fit: cover inside canvas)
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
    setHasStartedDrawing(true);

    // Update overlay text milestone
    const milestone = overlayMilestones.find((m) => index >= m.start && index <= m.end);
    setOverlayText(milestone?.text ?? '');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Orientation & Device Detection ────────────────────────────────────────
  useEffect(() => {
    const handleDeviceCheck = () => {
      const mobile = window.innerWidth <= 768 || window.innerHeight > window.innerWidth;
      setIsMobile((prev) => (prev !== mobile ? mobile : prev));
      if (canvasRef.current) {
        drawFrame(currentFrameRef.current);
      }
    };

    window.addEventListener('resize', handleDeviceCheck, { passive: true });
    window.addEventListener('orientationchange', handleDeviceCheck, { passive: true });
    return () => {
      window.removeEventListener('resize', handleDeviceCheck);
      window.removeEventListener('orientationchange', handleDeviceCheck);
    };
  }, [drawFrame]);

  // ── Scroll handler ────────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const rect = outer.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollableDistance = outer.offsetHeight - vh;
    if (scrollableDistance <= 0) return;

    const scrolled = -rect.top;
    const rawProgress = scrolled / scrollableDistance;
    const progress = Math.max(0, Math.min(1, rawProgress));
    setScrollProgress(progress);

    const count = activeConfig.frameCount;
    const frameIndex = Math.min(Math.floor(progress * count), count - 1);

    if (frameIndex !== currentFrameRef.current) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    }
  }, [activeConfig.frameCount, drawFrame]);

  // ── Preload active frames sequence ────────────────────────────────────────
  useEffect(() => {
    let isCancelled = false;
    const images: HTMLImageElement[] = [];
    let loaded = 0;
    const total = activeConfig.frameCount;
    const pad = activeConfig.padLength ?? 4;

    setLoadedCount(0);
    setAllLoaded(false);

    for (let i = 1; i <= total; i++) {
      const img = new Image();
      img.src = `${activeConfig.framePrefix}${padNum(i, pad)}.${activeConfig.frameExtension}`;

      img.onload = () => {
        if (isCancelled) return;
        loaded += 1;
        setLoadedCount(loaded);

        // Draw initial frame as soon as frame 1 is ready
        if (loaded === 1 && currentFrameRef.current === 0) {
          drawFrame(0);
        }

        if (loaded === total) {
          setAllLoaded(true);
          drawFrame(currentFrameRef.current);
        }
      };

      img.onerror = () => {
        if (isCancelled) return;
        loaded += 1;
        setLoadedCount(loaded);
        if (loaded === total) {
          setAllLoaded(true);
        }
      };

      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      isCancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [activeConfig, drawFrame]);

  // ── Attach scroll listener ────────────────────────────────────────────────
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const loadPercent = Math.min(
    100,
    Math.round((loadedCount / Math.max(1, activeConfig.frameCount)) * 100)
  );

  // Mobile scroll height multiplier: slightly snappier on mobile for natural thumb-scrubbing
  const effectiveMultiplier = isMobile
    ? Math.max(2.5, scrollMultiplier * 0.8)
    : scrollMultiplier;

  return (
    <div
      ref={outerRef}
      className={`scrolly-outer ${isMobile ? 'is-mobile-view' : 'is-desktop-view'}`}
      style={{ height: `${(effectiveMultiplier + 1) * 100}vh` }}
      aria-label="Sahyadri Glow handcrafted candle sequence"
    >
      {/* Luxury Loading Spinner Overlay */}
      {(!allLoaded || !hasStartedDrawing) && (
        <div className="scrolly-loader-overlay">
          <div className="scrolly-loader-inner">
            <div className="scrolly-spinner-ring" />
            <p className="scrolly-loader-brand">Sahyadri Glow</p>
            <p className="scrolly-loader-sub">
              {isMobile ? 'Pouring mobile experience...' : 'Pouring artisanal candles...'}
            </p>
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

        {/* Scroll cue hint / Explore button */}
        {allLoaded && scrollProgress < 0.9 && (
          <div className="scrolly-hint">
            <span>Scroll to explore</span>
            <span className="scrolly-hint-arrow">↓</span>
          </div>
        )}

        {/* Smooth transition button when near end of animation */}
        {allLoaded && scrollProgress >= 0.85 && onExploreClick && (
          <div className="scrolly-end-prompt">
            <button
              className="scrolly-explore-btn"
              onClick={onExploreClick}
              type="button"
            >
              Shop Collection ↓
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrollyCanvas;
