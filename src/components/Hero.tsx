"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowDown, Moon, Sun } from "lucide-react";
import { useLenis } from "lenis/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      // A tiny delay ensures the browser has finished initial paints
      const tl = gsap.timeline({ 
        paused: true,
        defaults: { ease: "power3.out", force3D: true }, 
        delay: 0.1 
      });
      
      tlRef.current = tl;

      // Scale and crop are compositor-accelerated on the inner container
      gsap.set(".hero-bg-container", {
        scale: 0.6,
        borderRadius: "20px",
        willChange: "transform, border-radius",
      });

      // Translation and fade are handled on the outer wrapper
      gsap.set(".hero-bg-wrapper", {
        yPercent: 55,
        opacity: 0,
        willChange: "transform, opacity",
      });

      // 1. Slide up the outer wrapper from below at small scale
      tl.to(
        ".hero-bg-wrapper",
        { yPercent: 0, opacity: 1, duration: 1.0, ease: "power3.out" }
      );

      // 2. Expand scale to full + lose border radius — one fluid motion on the inner container
      tl.to(
        ".hero-bg-container",
        { scale: 1, borderRadius: "0px", duration: 1.0, ease: "power2.inOut" },
        "-=0.5"
      );

      // 3. Overlay fades in as image fully appears
      tl.fromTo(
        ".hero-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.75"
      );

      // 5. First name
      tl.fromTo(
        ".hero-firstname",
        { yPercent: 105 },
        { yPercent: 0, duration: 1.0, ease: "power4.out" },
        "-=0.4"
      );

      // 6. Last name 
      tl.fromTo(
        ".hero-lastname",
        { yPercent: 105 },
        { yPercent: 0, duration: 1.5, ease: "power4.out" },
        "-=0.65"
      );

      // 7. Bottom accent line
      tl.fromTo(
        ".hero-line-bottom",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.0, ease: "power2.inOut" },
        "-=1.0"
      );

      // 8. Tagline
      tl.fromTo(
        ".hero-tagline",
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" },
        "-=0.5"
      );

      // 10. Scroll indicator
      tl.fromTo(
        ".hero-scroll",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.4"
      );

      // 11. Theme toggle
      tl.fromTo(
        ".hero-theme-btn",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      );

      // Release will-change after animation settles to free GPU memory
      tl.call(() => {
        gsap.set(".hero-bg-container", { willChange: "auto" });
        gsap.set(".hero-bg-wrapper", { willChange: "auto" });
      });

      // Continuous scroll bounce
      gsap.to(".hero-scroll-arrow", {
        y: 5,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.2,
      });
      
      // Check if images are already loaded (e.g. from cache)
      const img1 = document.querySelector(".hero-day-image") as HTMLImageElement;
      const img2 = document.querySelector(".hero-night-image") as HTMLImageElement;
      if (img1?.complete && img2?.complete) {
        tl.play();
      }
    },
    { scope: containerRef }
  );

  useEffect(() => {
    setMounted(true);

    const img1 = document.querySelector(".hero-day-image") as HTMLImageElement;
    const img2 = document.querySelector(".hero-night-image") as HTMLImageElement;
    
    let loaded = 0;
    const checkLoaded = () => {
      loaded += 1;
      if (loaded >= 2) {
        if (tlRef.current && tlRef.current.paused()) {
          tlRef.current.play();
        }
      }
    };

    if (img1) {
      if (img1.complete) checkLoaded();
      else img1.addEventListener("load", checkLoaded);
    }
    if (img2) {
      if (img2.complete) checkLoaded();
      else img2.addEventListener("load", checkLoaded);
    }

    return () => {
      if (img1) img1.removeEventListener("load", checkLoaded);
      if (img2) img2.removeEventListener("load", checkLoaded);
    };
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
      {/* Full-bleed background image container */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        {/* Double-wrapper: outer wrapper handles translation/opacity, inner handles scale/clipPath. Decoupled for hardware acceleration */}
        <div 
          className="hero-bg-wrapper w-full h-full relative overflow-hidden"
          style={{ opacity: 0 }}
        >
          <div className="hero-bg-container w-full h-full relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-day.webp"
              alt="Luxury interior space (Day)"
              className="hero-day-image hero-bg-image absolute inset-0 w-full h-full object-cover object-center"
              decoding="async"
              loading="eager"
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
      </div>


      {/* Main content */}
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

      {/* Scroll indicator — bottom center */}
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
        className="hero-theme-btn absolute bottom-8 sm:bottom-12 left-6 sm:left-10 md:left-14 z-40 flex items-center rounded-full border border-[#DDCCB7]/20 bg-[#4D342D]/20 backdrop-blur-md shadow-lg transition-all duration-500 hover:bg-[#4D342D]/40 hover:border-[#DDCCB7]/40 group cursor-pointer overflow-hidden px-4 py-2.5 gap-2.5 w-[92px] justify-start opacity-0"
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
        <div className="relative h-3.5 overflow-hidden flex items-center transition-all duration-500 w-12 opacity-100">
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
