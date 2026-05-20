"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowDown } from "lucide-react";
import { useLenis } from "lenis/react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Scale from a small card → full viewport.
      // scale() is compositor-accelerated (GPU-only, no layout), so no jank.
      // borderRadius on the container gives the rounded card look during the small state.
      gsap.set(".hero-bg-container", {
        scale: 0.6,
        borderRadius: "20px",
        willChange: "transform",
      });

      // 1. Slide up from below at small scale
      tl.fromTo(
        ".hero-bg-container",
        { y: "55vh", opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "power3.out" }
      );

      // 2. Expand scale to full + lose border radius — one fluid motion
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

      // 5. First name — slides up from beneath overflow-hidden clip (masked reveal)
      tl.fromTo(
        ".hero-firstname",
        { y: "105%" },
        { y: "0%", duration: 1.0, ease: "power4.out" },
        "-=0.4"
      );

      // 6. Last name — the centrepiece masked reveal.
      //    Starts while firstname is still in motion: cascade, not stagger.
      tl.fromTo(
        ".hero-lastname",
        { y: "105%" },
        { y: "0%", duration: 1.5, ease: "power4.out" },
        "-=0.65"
      );

      // 7. Bottom accent line — draws as the name settles
      tl.fromTo(
        ".hero-line-bottom",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.0, ease: "power2.inOut" },
        "-=1.0"
      );

      // 8. Tagline — clean opacity dissolve, no expanding tracking
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

      // Release will-change after animation settles to free GPU memory
      tl.call(() => {
        gsap.set(".hero-bg-container", { willChange: "auto", clearProps: "borderRadius" });
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
    },
    { scope: containerRef }
  );

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
        <div className="hero-bg-container w-full h-full relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-day.jpg"
            alt="Luxury interior space (Day)"
            className="hero-day-image hero-bg-image absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen object-cover object-center"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-night.png"
            alt="Luxury interior space (Night)"
            className="hero-night-image hero-bg-image absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen object-cover object-center"
          />
          {/* Subtle overlay for text readability */}
          <div className="hero-overlay absolute inset-0 bg-[#4D342D]/20 opacity-0" />
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
    </section>
  );
}
