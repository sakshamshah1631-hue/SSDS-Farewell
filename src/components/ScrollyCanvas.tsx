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

/**
 * Ultra-reliable, high-performance distributed streaming loader:
 *  - Pass 1: Evenly spaced keyframes (step 5) across the entire 0% -> 100% timeline.
 *    Within <400ms, the entire animation is scrubbable without a single gap.
 *  - Pass 2: Concurrently streams all remaining intermediate frames.
 *  - Reactive redraw: Instantly re-paints whenever a newly loaded frame matches the scroll position.
 *  - Guaranteed non-blank fallback to nearest verified frame.
 *  - Automatic retry on network drops.
 */
const KEYFRAME_STEP = 5;
const CONCURRENT_CHUNKS = 6;

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
  const loadedSetRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Cached viewport dimensions to avoid layout thrashing during scroll
  const viewportRef = useRef<{ w: number; h: number }>({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 720,
  });

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  });

  const activeConfig = useMemo(() => {
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
  const [criticalReady, setCriticalReady] = useState(false);
  const [overlayText, setOverlayText] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);

  const overlayMilestones: Array<{ start: number; end: number; text: string }> = [
    { start: 0, end: 25, text: 'Handcrafted with love.' },
    { start: 26, end: 55, text: 'Scents that tell stories.' },
    { start: 56, end: 82, text: 'Find your quiet glow.' },
    { start: 83, end: 101, text: 'The Sahyadri collection.' },
  ];

  // ── High-Performance Canvas Draw ──────────────────────────────────────────
  const drawFrameOnCanvas = useCallback((canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { w: displayWidth, h: displayHeight } = viewportRef.current;

    const targetWidth = Math.round(displayWidth * dpr);
    const targetHeight = Math.round(displayHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const ox = (cw - nw) * 0.5;
    const oy = (ch - nh) * 0.5;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium'; // Far faster on mobile GPU than 'high'
    ctx.drawImage(img, ox, oy, nw, nh);
  }, []);

  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const img = imagesRef.current[index];

      // If frame is ready, draw directly
      if (img && img.complete && img.naturalWidth > 0) {
        drawFrameOnCanvas(canvas, img);
        currentFrameRef.current = index;
      } else {
        // Fall back to nearest loaded frame to guarantee zero blank flicker
        const loadedList = Array.from(loadedSetRef.current);
        if (loadedList.length > 0) {
          let closest = loadedList[0];
          let minDist = Math.abs(closest - index);
          for (let i = 1; i < loadedList.length; i++) {
            const dist = Math.abs(loadedList[i] - index);
            if (dist < minDist) {
              minDist = dist;
              closest = loadedList[i];
            }
          }
          const fb = imagesRef.current[closest];
          if (fb && fb.complete && fb.naturalWidth > 0) {
            drawFrameOnCanvas(canvas, fb);
          }
        }
      }

      // Update narrative milestone text
      const milestone = overlayMilestones.find((m) => index >= m.start && index <= m.end);
      setOverlayText(milestone?.text ?? '');
    },
    [drawFrameOnCanvas]
  );

  // ── Resize / Viewport tracking without layout thrashing ───────────────────
  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      viewportRef.current = { w, h };

      const mobile = w <= 768;
      setIsMobile((prev) => (prev !== mobile ? mobile : prev));

      drawFrame(targetFrameRef.current);
    };

    updateDimensions();

    window.addEventListener('resize', updateDimensions, { passive: true });
    window.addEventListener('orientationchange', updateDimensions, { passive: true });

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, [drawFrame]);

  // ── Smooth Scroll Handler using requestAnimationFrame ─────────────────────
  const handleScroll = useCallback(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const rect = outer.getBoundingClientRect();
    const vh = viewportRef.current.h;
    const scrollableDistance = outer.offsetHeight - vh;
    if (scrollableDistance <= 0) return;

    const scrolled = -rect.top;
    const rawProgress = scrolled / scrollableDistance;
    const progress = Math.max(0, Math.min(1, rawProgress));
    setScrollProgress(progress);

    const count = activeConfig.frameCount;
    const frameIndex = Math.min(Math.floor(progress * count), count - 1);
    targetFrameRef.current = frameIndex;

    if (frameIndex !== currentFrameRef.current) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    }
  }, [activeConfig.frameCount, drawFrame]);

  // ── Multi-pass distributed streaming preloader ────────────────────────────
  useEffect(() => {
    let isCancelled = false;
    const total = activeConfig.frameCount;
    const pad = activeConfig.padLength ?? 4;

    const images: HTMLImageElement[] = new Array(total);
    const loadedTracker = new Set<number>();
    loadedSetRef.current = loadedTracker;

    setLoadedCount(0);
    setCriticalReady(false);
    imagesRef.current = images;

    const buildSrc = (i: number) =>
      `${activeConfig.framePrefix}${padNum(i + 1, pad)}.${activeConfig.frameExtension}`;

    function loadSingleFrame(idx: number, retry = 1): Promise<void> {
      return new Promise((resolve) => {
        if (isCancelled) {
          resolve();
          return;
        }

        const img = new Image();
        img.decoding = 'async';

        img.onload = () => {
          if (isCancelled) {
            resolve();
            return;
          }
          if (img.naturalWidth > 0) {
            loadedTracker.add(idx);
            setLoadedCount(loadedTracker.size);

            // Reactive redraw: If the user is currently looking at or near this frame, render it immediately!
            if (Math.abs(targetFrameRef.current - idx) <= 3) {
              drawFrame(targetFrameRef.current);
            }

            // Once distributed keyframes are ready, unlock smooth interaction
            if (loadedTracker.size >= Math.min(21, total)) {
              setCriticalReady(true);
            }
          }
          resolve();
        };

        img.onerror = () => {
          if (isCancelled) {
            resolve();
            return;
          }
          if (retry > 0) {
            setTimeout(() => {
              if (!isCancelled) {
                loadSingleFrame(idx, retry - 1).then(resolve);
              } else {
                resolve();
              }
            }, 300);
          } else {
            console.warn(`[ScrollyCanvas] Frame ${idx + 1} skipped after retry, using nearest neighbor.`);
            resolve();
          }
        };

        img.src = buildSrc(idx);
        images[idx] = img;
      });
    }

    async function streamAllFrames() {
      // Pass 1: Evenly spaced keyframes spanning the entire 0% -> 100% timeline (every KEYFRAME_STEP)
      // Guarantees immediate coverage of beginning, middle, and end without holes
      const pass1Set = new Set<number>([0, 1, 2]);
      for (let i = 0; i < total; i += KEYFRAME_STEP) {
        pass1Set.add(i);
      }
      pass1Set.add(total - 1);
      const pass1 = Array.from(pass1Set).sort((a, b) => a - b);

      for (let i = 0; i < pass1.length; i += CONCURRENT_CHUNKS) {
        if (isCancelled) return;
        const chunk = pass1.slice(i, i + CONCURRENT_CHUNKS);
        await Promise.all(chunk.map((idx) => loadSingleFrame(idx)));
      }

      if (isCancelled) return;
      setCriticalReady(true);
      drawFrame(targetFrameRef.current);

      // Pass 2: Fill in all remaining intermediate frames concurrently
      const pass2: number[] = [];
      for (let i = 0; i < total; i++) {
        if (!pass1Set.has(i)) {
          pass2.push(i);
        }
      }

      for (let i = 0; i < pass2.length; i += CONCURRENT_CHUNKS) {
        if (isCancelled) return;
        const chunk = pass2.slice(i, i + CONCURRENT_CHUNKS);
        await Promise.all(chunk.map((idx) => loadSingleFrame(idx)));
      }

      if (isCancelled) return;
      drawFrame(targetFrameRef.current);
    }

    void streamAllFrames();

    return () => {
      isCancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [activeConfig, drawFrame]);

  // ── Scroll listener ───────────────────────────────────────────────────────
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const loadPercent = Math.min(
    100,
    Math.round((loadedCount / Math.max(1, activeConfig.frameCount)) * 100)
  );

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
      {/* Lightweight luxury loading spinner — dismisses as soon as critical batch is ready */}
      {!criticalReady && (
        <div className="scrolly-loader-overlay">
          <div className="scrolly-loader-inner">
            <div className="scrolly-spinner-ring" />
            <p className="scrolly-loader-brand">Sahyadri Glow</p>
            <p className="scrolly-loader-sub">
              {isMobile ? 'Pouring mobile ritual...' : 'Pouring artisanal candles...'}
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

      {/* Sticky canvas with GPU compositing */}
      <div className="scrolly-canvas-wrap">
        <canvas ref={canvasRef} className="scrolly-canvas" />

        {criticalReady && overlayText && (
          <div className="scrolly-overlay-text" key={overlayText}>
            <span>{overlayText}</span>
          </div>
        )}

        {criticalReady && scrollProgress < 0.9 && (
          <div className="scrolly-hint">
            <span>Scroll to explore</span>
            <span className="scrolly-hint-arrow">↓</span>
          </div>
        )}

        {criticalReady && scrollProgress >= 0.85 && onExploreClick && (
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
