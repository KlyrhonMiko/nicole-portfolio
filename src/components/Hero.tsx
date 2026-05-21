"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowDown, Moon, Sun } from "lucide-react";
import { useLenis } from "lenis/react";
import { useTheme } from "next-themes";

interface HeroProps {
  isLoaded?: boolean;
}

export default function Hero({ isLoaded = false }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const hasPlayedRef = useRef(false);

  // ── Build the GSAP timeline (paused) ──
  useGSAP(
    () => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out", force3D: true },
      });

      tlRef.current = tl;

      // ── Set initial state via GSAP so it owns all animated values ──
      // ONLY transform + opacity are animated — the two cheapest GPU-composited properties.
      // borderRadius is static CSS on the element (never animated = no repaints).
      gsap.set(".hero-bg-wrapper", {
        yPercent: 55,
        scale: 0.82,
        opacity: 0,
        force3D: true,
        willChange: "transform, opacity",
      });

      // ── Phase 1 — Background reveal ──
      // Both yPercent and scale are part of the SAME CSS `transform` property,
      // so GSAP combines them into one matrix per frame. No new compositor
      // property is ever introduced mid-animation (unlike clipPath which
      // caused the stutter at the overlap point).

      // Slide up + fade in
      tl.to(".hero-bg-wrapper", {
        yPercent: 0,
        opacity: 1,
        duration: 1.0,
        ease: "power3.out",
      });

      // Scale expand (overlaps last 0.5s — same `transform` property, zero compositor cost)
      tl.to(
        ".hero-bg-wrapper",
        {
          scale: 1,
          duration: 1.0,
          ease: "power2.inOut",
        },
        "-=0.5"
      );

      // Snap away the static borderRadius once fully expanded (imperceptible at viewport scale)
      tl.set(".hero-bg-wrapper", { borderRadius: 0 });

      // ── Phase 2 — Content reveal ──

      // Overlay fades in
      tl.fromTo(
        ".hero-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.75"
      );

      // "nicole" (large serif)
      tl.fromTo(
        ".hero-lastname",
        { yPercent: 105 },
        { yPercent: 0, duration: 1.0, ease: "power4.out" },
        "-=0.4"
      );

      // "Airish Moran" (small sans)
      tl.fromTo(
        ".hero-firstname",
        { yPercent: 105 },
        { yPercent: 0, duration: 1.5, ease: "power4.out" },
        "-=0.65"
      );

      // Bottom accent line — use scaleX (transform-only, compositor-friendly)
      tl.fromTo(
        ".hero-line-bottom",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.0, ease: "power2.inOut" },
        "-=1.0"
      );

      // Tagline
      tl.fromTo(
        ".hero-tagline",
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" },
        "-=0.5"
      );

      // Scroll indicator
      tl.fromTo(
        ".hero-scroll",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.4"
      );

      // Theme toggle
      tl.fromTo(
        ".hero-theme-btn",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      );

      // Release will-change after the entire animation is done to free GPU memory
      tl.call(() => {
        gsap.set(".hero-bg-wrapper", { willChange: "auto" });
      });

      // ── Infinite scroll-arrow bounce ──
      gsap.to(".hero-scroll-arrow", {
        y: 5,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.2,
      });
    },
    { scope: containerRef }
  );

  // ── Play the timeline once isLoaded becomes true ──
  useEffect(() => {
    if (!isLoaded || hasPlayedRef.current || !tlRef.current) return;
    hasPlayedRef.current = true;

    // Double-rAF lets the browser finish any pending layout / paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tlRef.current?.play();
      });
    });
  }, [isLoaded]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToNext = () => {
    if (lenis) {
      lenis.scrollTo("#works-3d", { offset: 0, duration: 1.2 });
    } else {
      const el = document.getElementById("works-3d");
      if (el) {
        window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* ── Background image ── */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        {/*
          Single wrapper — GSAP animates ONLY transform (yPercent + scale) and opacity.
          borderRadius is static CSS, snapped to 0 after animation ends.
          opacity:0 inline prevents FOUC.
        */}
        <div
          className="hero-bg-wrapper w-full h-full relative overflow-hidden rounded-[20px]"
          style={{ opacity: 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-day.webp"
            alt="Luxury interior space (Day)"
            className="hero-day-image hero-bg-image absolute inset-0 w-full h-full object-cover object-center"
            decoding="async"
            loading="eager"
            fetchPriority="high"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-night.webp"
            alt="Luxury interior space (Night)"
            className="hero-night-image hero-bg-image absolute inset-0 w-full h-full object-cover object-center"
            decoding="async"
            loading="eager"
          />
          {/* Subtle overlay for text readability */}
          <div className="hero-overlay absolute inset-0 bg-[#4D342D]/20 opacity-0" />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 select-none w-full">
        {/* Name block */}
        <div className="relative flex flex-col items-center justify-center">
          {/* First Name — elegant, faint serif signature */}
          <div className="overflow-hidden z-0 -mb-4 sm:-mb-6 md:-mb-8 opacity-40">
            <h1 className="hero-lastname font-serif italic text-[clamp(4rem,15vw,12rem)] leading-[0.85] text-[#DDCCB7] font-light lowercase pr-2">
              nicole
            </h1>
          </div>

          {/* Middle + Surname */}
          <div className="overflow-hidden pb-1 z-10 relative">
            <p className="hero-firstname font-sans text-[11px] sm:text-xs md:text-[14px] tracking-[0.6em] uppercase text-[#EDE7DB] font-normal pl-[0.6em]">
              Airish Moran
            </p>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="hero-line-bottom w-24 h-px bg-[#DDCCB7]/40 mt-8 mb-6 origin-center" />

        {/* Tagline */}
        <p className="hero-tagline font-sans text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.55em] uppercase text-[#DDCCB7]/55 font-light opacity-0">
          Interior Designer
        </p>
      </div>

      {/* ── Scroll indicator ── */}
      <button
        onClick={scrollToNext}
        className="hero-scroll absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 opacity-0 cursor-pointer group"
        aria-label="Scroll to explore"
      >
        <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.4em] uppercase text-[#DDCCB7]/40 group-hover:text-[#DDCCB7]/70 transition-colors duration-500">
          Scroll
        </span>
        <ArrowDown className="hero-scroll-arrow w-3.5 h-3.5 text-[#DDCCB7]/40 group-hover:text-[#DDCCB7]/70 transition-colors duration-500" />
      </button>

      {/* ── Theme Toggle ── */}
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={`hero-theme-btn absolute bottom-8 sm:bottom-12 left-6 sm:left-10 md:left-14 z-40 flex items-center rounded-full border border-[#DDCCB7]/20 bg-[#4D342D]/20 backdrop-blur-md shadow-lg transition-all duration-500 hover:bg-[#4D342D]/40 hover:border-[#DDCCB7]/40 group cursor-pointer overflow-hidden px-4 py-2.5 gap-2.5 justify-start opacity-0 ${
          mounted && resolvedTheme === "dark" ? "w-[92px]" : "w-[80px]"
        }`}
        aria-label="Toggle dark mode"
      >
        {/* Icon container with vertical slide */}
        <div className="relative w-3.5 h-3.5 flex items-center justify-center overflow-hidden shrink-0">
          <div className={`absolute transition-all duration-500 ${mounted && resolvedTheme === 'dark' ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
            <Sun className="w-3.5 h-3.5 text-[#EDE7DB]" strokeWidth={1.5} />
          </div>
          <div className={`absolute transition-all duration-500 ${mounted && resolvedTheme === 'dark' ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            <Moon className="w-3.5 h-3.5 text-[#EDE7DB]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text container with vertical slide */}
        <div className="relative h-3.5 overflow-hidden flex items-center transition-all duration-500 w-full opacity-100">
           <span className={`absolute left-0 text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-light text-[#EDE7DB] transition-all duration-500 ${mounted && resolvedTheme === 'dark' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
             Night
           </span>
           <span className={`absolute left-0 text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-light text-[#EDE7DB] transition-all duration-500 ${mounted && resolvedTheme !== 'dark' ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
             Day
           </span>
        </div>
      </button>
    </section>
  );
}
