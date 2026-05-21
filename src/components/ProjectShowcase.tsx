"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import Lenis from "lenis";

export interface ProjectData {
  id: number | string;
  title: string;
  category: string;
  color: string;
  textColor: string;
  heroImage: string;
  concept: {
    headline: string;
    description: string;
  };
  details: {
    location: string;
    area: string;
    year: string;
    style: string;
  };
  floorplan: string;
  perspectives: string[];
  sections: {
    title: string;
    image: string;
    description: string;
  }[];
  materials: {
    name: string;
    color: string;
  }[];
}

interface ProjectShowcaseProps {
  project: ProjectData | null;
  onClose: () => void;
}

export default function ProjectShowcase({ project, onClose }: ProjectShowcaseProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (!overlayRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(contentRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    }).to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      },
      "-=0.15"
    );
  }, [onClose]);

  // Entrance animation
  useEffect(() => {
    if (!project || !overlayRef.current || !contentRef.current) return;

    // Lock body scroll
    document.body.style.overflow = "hidden";

    // Reset scroll position
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }

    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(contentRef.current, { y: 60, opacity: 0 });

    const tl = gsap.timeline();

    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    }).to(
      contentRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.2"
    );

    // Stagger reveal inner elements
    const revealEls = contentRef.current.querySelectorAll("[data-reveal]");
    if (revealEls.length > 0) {
      gsap.from(revealEls, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.5,
      });
    }

    // Accent line animations
    const accentLines = contentRef.current.querySelectorAll("[data-accent-line]");
    if (accentLines.length > 0) {
      gsap.fromTo(
        accentLines,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.0,
          stagger: 0.15,
          ease: "power2.inOut",
          delay: 0.7,
        }
      );
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  // Initialize Lenis for the modal scroll container
  useEffect(() => {
    if (!project || !scrollContainerRef.current) return;

    // We create a local Lenis instance specifically for this scrolling div
    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      content: scrollContainerRef.current.firstElementChild as HTMLElement,
      duration: 1.2,
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [project]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose]);

  if (!project) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999]"
      style={{ opacity: 0 }}
    >
      {/* Full-screen background */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: project.color }}
      />

      {/* Grain texture overlay — matches Works section */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
          backgroundRepeat: "repeat",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      />

      {/* Close Button — editorial, minimal */}
      <button
        onClick={handleClose}
        className="fixed top-6 right-6 md:top-10 md:right-10 z-[10001] flex items-center gap-3 group cursor-pointer"
        style={{ color: project.textColor }}
        aria-label="Close project"
      >
        <span className="font-sans text-[9px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-50 transition-opacity duration-500 hidden md:block">
          Close
        </span>
        <div
          className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ borderColor: `${project.textColor}30` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:rotate-90"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </button>

      {/* Scrollable Content — full-screen takeover */}
      <div
        ref={contentRef}
        className="relative z-[10000] w-full h-full overflow-hidden"
        style={{ color: project.textColor }}
      >
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto h-full overscroll-contain"
          style={{ transform: "translateZ(0)", willChange: "transform" }}
          data-lenis-prevent
        >
          <div>
            {/* ═══════════════════════════════════════════════════
              HERO — Full-bleed cinematic
          ═══════════════════════════════════════════════════ */}
          <div className="relative h-screen w-full overflow-hidden" data-reveal>
            <img
              src={project.heroImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${project.color} 0%, ${project.color}99 20%, transparent 50%, transparent 70%, ${project.color}40 100%)`,
              }}
            />

            {/* Hero Typography — matching the site's editorial system */}
            <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 lg:px-24 pb-12 md:pb-20">
              <p className="font-sans text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.55em] uppercase font-light mb-4 md:mb-6 opacity-50">
                {project.category}
              </p>

              <div className="overflow-hidden pb-4 -mb-4">
                <h2 className="font-serif italic text-[clamp(3rem,10vw,7rem)] leading-[0.9] font-light lowercase tracking-tight pb-2">
                  {project.title}
                </h2>
              </div>

              <div
                className="w-24 h-px mt-8 origin-left"
                style={{ backgroundColor: `${project.textColor}30` }}
                data-accent-line
              />
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-6 md:bottom-10 right-6 md:right-16 lg:right-24 flex flex-col items-center gap-2 opacity-40">
              <span className="font-sans text-[8px] tracking-[0.3em] uppercase">Scroll</span>
              <div
                className="w-px h-8 bg-gradient-to-b from-current to-transparent"
              />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              PROJECT DETAILS — Editorial meta bar
          ═══════════════════════════════════════════════════ */}
          <div className="relative" style={{ backgroundColor: project.color }}>
            <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
              <div
                className="grid grid-cols-2 md:grid-cols-4 py-10 md:py-14"
                style={{ borderBottom: `1px solid ${project.textColor}10` }}
                data-reveal
              >
                {[
                  { label: "Location", value: project.details.location },
                  { label: "Area", value: project.details.area },
                  { label: "Year", value: project.details.year },
                  { label: "Style", value: project.details.style },
                ].map((detail) => (
                  <div key={detail.label} className="py-3 md:py-0">
                    <span className="font-sans text-[9px] md:text-[10px] tracking-[0.35em] uppercase opacity-35 block mb-2">
                      {detail.label}
                    </span>
                    <span className="font-serif italic text-base md:text-lg">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              DESIGN CONCEPT — Centered editorial statement
          ═══════════════════════════════════════════════════ */}
          <div
            className="relative py-24 md:py-36"
            style={{ backgroundColor: project.color }}
          >
            <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 text-center">
              <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.55em] uppercase opacity-35 mb-8 md:mb-10" data-reveal>
                Design Concept
              </p>

              <div className="max-w-3xl mx-auto" data-reveal>
                <h3 className="font-serif italic text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.1] tracking-wide mb-8 md:mb-10">
                  &ldquo;{project.concept.headline}&rdquo;
                </h3>
              </div>

              <div
                className="w-12 h-px mx-auto mb-8 md:mb-10 origin-center"
                style={{ backgroundColor: `${project.textColor}20` }}
                data-accent-line
              />

              <p className="font-sans text-sm md:text-base leading-[1.85] opacity-60 max-w-xl mx-auto" data-reveal>
                {project.concept.description}
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              FLOORPLAN — Full-width with editorial label
          ═══════════════════════════════════════════════════ */}
          <div
            className="relative py-16 md:py-24"
            style={{ backgroundColor: project.color }}
          >
            <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
              <div className="flex items-center gap-4 mb-8 md:mb-12" data-reveal>
                <div
                  className="w-12 h-px origin-left"
                  style={{ backgroundColor: `${project.textColor}20` }}
                  data-accent-line
                />
                <span className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase opacity-40">
                  Floor Plan
                </span>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden" data-reveal>
                <img
                  src={project.floorplan}
                  alt={`${project.title} – Floor Plan`}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(to top, ${project.color}30 0%, transparent 30%)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              PERSPECTIVES — Cinematic image grid
          ═══════════════════════════════════════════════════ */}
          <div
            className="relative py-16 md:py-24"
            style={{ backgroundColor: project.color }}
          >
            <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
              <div className="flex items-center gap-4 mb-8 md:mb-12" data-reveal>
                <div
                  className="w-12 h-px origin-left"
                  style={{ backgroundColor: `${project.textColor}20` }}
                  data-accent-line
                />
                <span className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase opacity-40">
                  Perspectives
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
                {project.perspectives.map((img, i) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden group ${
                      i === 0
                        ? "md:col-span-12 aspect-[21/9]"
                        : "md:col-span-6 aspect-[4/3]"
                    }`}
                    data-reveal
                  >
                    <img
                      src={img}
                      alt={`${project.title} perspective ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Vignette */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(to top, ${project.color}40 0%, transparent 40%)`,
                      }}
                    />
                    {/* Index label */}
                    <span
                      className="absolute bottom-4 right-4 font-sans text-[9px] tracking-[0.2em] uppercase opacity-30"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              DESIGN SECTIONS — Alternating asymmetric layout (matches Works)
          ═══════════════════════════════════════════════════ */}
          <div
            className="relative"
            style={{ backgroundColor: project.color }}
          >
            {project.sections.map((section, i) => {
              const isEven = i % 2 === 0;

              return (
                <div
                  key={i}
                  className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 py-16 md:py-28"
                  style={{
                    borderTop: i === 0 ? `1px solid ${project.textColor}08` : "none",
                  }}
                >
                  <article
                    className={`flex flex-col ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    } gap-8 md:gap-12 lg:gap-20 items-start`}
                    data-reveal
                  >
                    {/* Image */}
                    <div className="w-full md:w-[60%] lg:w-[62%] flex-shrink-0">
                      <div className="relative aspect-[4/3] overflow-hidden group">
                        <img
                          src={section.image}
                          alt={section.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        {/* Subtle vignette */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `linear-gradient(to top, ${project.color}30 0%, transparent 40%)`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div
                      className={`w-full md:w-[40%] lg:w-[38%] flex flex-col justify-end md:py-8 ${
                        isEven ? "md:items-start" : "md:items-end md:text-right"
                      }`}
                    >
                      {/* Index */}
                      <span className="font-mono text-[10px] tracking-[0.2em] opacity-15 mb-4 block">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Title */}
                      <h4 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-wide leading-tight mb-5">
                        {section.title}
                      </h4>

                      {/* Thin accent */}
                      <div
                        className={`w-10 h-px mb-6 ${
                          isEven ? "origin-left" : "origin-right"
                        }`}
                        style={{ backgroundColor: `${project.textColor}20` }}
                        data-accent-line
                      />

                      {/* Description */}
                      <p className="font-sans text-sm md:text-base leading-[1.85] opacity-60">
                        {section.description}
                      </p>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════════════
              MATERIAL PALETTE — Refined editorial display
          ═══════════════════════════════════════════════════ */}
          <div
            className="relative py-20 md:py-32"
            style={{ backgroundColor: project.color }}
          >
            <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
              <div className="flex items-center gap-4 mb-12 md:mb-16" data-reveal>
                <div
                  className="w-12 h-px origin-left"
                  style={{ backgroundColor: `${project.textColor}20` }}
                  data-accent-line
                />
                <span className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase opacity-40">
                  Material Palette
                </span>
              </div>

              <div className="flex flex-wrap gap-10 md:gap-16" data-reveal>
                {project.materials.map((mat, i) => (
                  <div key={i} className="flex flex-col items-center gap-4 group">
                    <div
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundColor: mat.color,
                        boxShadow: `inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 12px ${mat.color}40`,
                      }}
                    />
                    <span className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                      {mat.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              BOTTOM CTA — Editorial return link
          ═══════════════════════════════════════════════════ */}
          <div
            className="relative py-16 md:py-24"
            style={{
              backgroundColor: project.color,
              borderTop: `1px solid ${project.textColor}08`,
            }}
          >
            <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 flex items-center justify-between" data-reveal>
              <button
                onClick={handleClose}
                className="flex items-center gap-4 group cursor-pointer"
                style={{ color: project.textColor }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-30 group-hover:opacity-70 transition-all duration-500 group-hover:-translate-x-1"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase opacity-40 group-hover:opacity-80 transition-opacity duration-500">
                  Back to Gallery
                </span>
              </button>

              {/* Year watermark — matches the Works section editorial year treatment */}
              <span
                className="font-serif italic text-5xl lg:text-6xl opacity-[0.08] select-none leading-none hidden md:block"
              >
                {project.details.year}
              </span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
