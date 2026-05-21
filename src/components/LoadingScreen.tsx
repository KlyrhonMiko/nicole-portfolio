"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const completedRef = useRef(false);

  // ── Dual gate: exit only when BOTH conditions are true ──
  const entranceDoneRef = useRef(false);
  const assetsReadyRef = useRef(false);

  const tryExit = useCallback(() => {
    if (completedRef.current) return;
    if (!entranceDoneRef.current || !assetsReadyRef.current) return;
    completedRef.current = true;

    // Brief pause at 100% so the user registers completion
    setTimeout(() => {
      playExitAnimation();
    }, 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Preload all critical assets ──
  const preloadAssets = useCallback(async () => {
    const totalSteps = 4;
    let completed = 0;

    const tick = () => {
      completed++;
      const pct = Math.round((completed / totalSteps) * 100);
      progressRef.current = pct;
      setProgress(pct);
    };

    try {
      // 1. Preload hero day image
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.src = "/hero-day.webp";
        img.onload = () => { img.decode?.().then(resolve).catch(resolve); };
        img.onerror = () => resolve();
        if (img.complete) img.decode?.().then(resolve).catch(resolve);
      });
      tick();

      // 2. Preload hero night image
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.src = "/hero-night.webp";
        img.onload = () => { img.decode?.().then(resolve).catch(resolve); };
        img.onerror = () => resolve();
        if (img.complete) img.decode?.().then(resolve).catch(resolve);
      });
      tick();

      // 3. Wait for fonts
      await document.fonts.ready;
      tick();

      // 4. Small buffer for layout settlement
      await new Promise((r) => setTimeout(r, 200));
      tick();
    } catch {
      // On any error, fill remaining
      while (completed < totalSteps) tick();
    }

    assetsReadyRef.current = true;
    tryExit();
  }, [tryExit]);

  // ── Entrance animation for loading screen elements ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          // Gate 1 satisfied — entrance is fully done
          entranceDoneRef.current = true;
          tryExit();
        },
      });

      // Vertical line draws down
      tl.fromTo(
        ".loader-line",
        { scaleY: 0 },
        { scaleY: 1, duration: 0.8, ease: "power2.inOut" }
      );

      // Name slides up from mask
      tl.fromTo(
        ".loader-name",
        { yPercent: 110 },
        { yPercent: 0, duration: 0.7, ease: "power4.out" },
        "-=0.2"
      );

      // Subtitle fades in
      tl.fromTo(
        ".loader-subtitle",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3"
      );

      // Progress bar container appears
      tl.fromTo(
        ".loader-progress-track",
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.5, ease: "power2.inOut" },
        "-=0.2"
      );

      // Progress number
      tl.fromTo(
        ".loader-percent",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        "-=0.2"
      );

      // Corner accents fade in
      tl.fromTo(
        ".loader-corner",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, stagger: 0.08 },
        "-=0.3"
      );
    }, containerRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Animate progress bar fill ──
  useEffect(() => {
    const interval = setInterval(() => {
      const bar = containerRef.current?.querySelector(".loader-progress-fill") as HTMLElement;
      if (bar) {
        bar.style.transform = `scaleX(${progressRef.current / 100})`;
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // ── Start preloading ──
  useEffect(() => {
    preloadAssets();

    // Hard fallback: exit after 6s no matter what
    const fallback = setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      progressRef.current = 100;
      setProgress(100);
      setTimeout(() => playExitAnimation(), 300);
    }, 6000);

    return () => clearTimeout(fallback);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playExitAnimation = () => {
    gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          onComplete();
        },
      });

      // Fade out the progress elements
      tl.to(".loader-percent, .loader-progress-track", {
        opacity: 0,
        duration: 0.3,
      });

      // Name + subtitle slide up and fade
      tl.to(".loader-name-wrapper", {
        yPercent: -30,
        opacity: 0,
        duration: 0.5,
      }, "-=0.1");

      tl.to(".loader-subtitle", {
        opacity: 0,
        y: -10,
        duration: 0.3,
      }, "<");

      // Line shrinks
      tl.to(".loader-line", {
        scaleY: 0,
        duration: 0.4,
        ease: "power2.in",
      }, "-=0.3");

      // Corner accents fade
      tl.to(".loader-corner", {
        opacity: 0,
        duration: 0.2,
      }, "-=0.4");

      // Split curtain exit — the two panels slide away
      tl.to(".loader-panel-left", {
        yPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
      }, "-=0.1");

      tl.to(".loader-panel-right", {
        yPercent: 100,
        duration: 0.7,
        ease: "power4.inOut",
      }, "<");
    }, containerRef);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-hidden="true"
    >
      {/* ── Two-panel background for curtain exit ── */}
      <div className="loader-panel-left absolute top-0 left-0 w-full h-1/2 bg-[#3D2820]" />
      <div className="loader-panel-right absolute bottom-0 left-0 w-full h-1/2 bg-[#3D2820]" />

      {/* ── Centered content ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
        {/* Vertical accent line */}
        <div className="loader-line w-px h-12 bg-[#DDCCB7]/25 origin-top mb-6" style={{ transform: "scaleY(0)" }} />

        {/* Name (masked slide) */}
        <div className="loader-name-wrapper overflow-hidden mb-2">
          <p className="loader-name font-serif italic text-[clamp(1.5rem,4vw,2.5rem)] leading-tight text-[#EDE7DB] font-light tracking-[0.04em] select-none">
            Nicole Airish Moran
          </p>
        </div>

        {/* Subtitle */}
        <p className="loader-subtitle text-[9px] sm:text-[10px] tracking-[0.5em] uppercase text-[#DDCCB7]/40 font-light mb-10 opacity-0 select-none">
          Interior Design Portfolio
        </p>

        {/* Progress bar */}
        <div className="flex flex-col items-center gap-3 w-40">
          <div className="loader-progress-track w-full h-px bg-[#DDCCB7]/10 origin-center overflow-hidden" style={{ transform: "scaleX(0)" }}>
            <div
              className="loader-progress-fill w-full h-full bg-[#DDCCB7]/50 origin-left transition-transform duration-300 ease-out"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          {/* Percentage */}
          <span className="loader-percent font-mono text-[10px] tracking-[0.3em] text-[#DDCCB7]/30 tabular-nums opacity-0 select-none">
            {progress}%
          </span>
        </div>
      </div>

      {/* ── Corner accents ── */}
      <span className="loader-corner absolute top-6 left-6 sm:top-8 sm:left-10 text-[8px] tracking-[0.4em] uppercase text-[#DDCCB7]/15 font-light select-none opacity-0">
        Portfolio
      </span>
      <span className="loader-corner absolute top-6 right-6 sm:top-8 sm:right-10 text-[8px] tracking-[0.4em] uppercase text-[#DDCCB7]/15 font-light select-none opacity-0">
        2025
      </span>
      <span className="loader-corner absolute bottom-6 left-6 sm:bottom-8 sm:left-10 text-[8px] tracking-[0.4em] uppercase text-[#DDCCB7]/15 font-light select-none opacity-0">
        Loading
      </span>
      <span className="loader-corner absolute bottom-6 right-6 sm:bottom-8 sm:right-10 text-[8px] tracking-[0.4em] uppercase text-[#DDCCB7]/15 font-light select-none font-mono tabular-nums opacity-0">
        {String(progress).padStart(3, "0")}
      </span>
    </div>
  );
}
