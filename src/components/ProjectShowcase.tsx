"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

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
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.5,
      });
    }

    return () => {
      document.body.style.overflow = "";
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
      className="fixed inset-0 z-[9999] flex items-start justify-center"
      style={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
        onClick={handleClose}
      />

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-6 right-6 md:top-8 md:right-8 z-[10001] w-12 h-12 rounded-full bg-[#1A1410]/80 text-[#E5E0D8] flex items-center justify-center backdrop-blur-sm hover:bg-[#4D342D] transition-colors duration-300 group cursor-pointer"
        aria-label="Close project"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
      </button>

      {/* Content Panel */}
      <div
        ref={contentRef}
        className="relative z-[10000] w-full max-w-5xl mx-4 my-4 md:my-8 max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] overflow-hidden rounded-lg shadow-2xl"
        style={{
          backgroundColor: project.color,
          color: project.textColor,
        }}
      >
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] overscroll-contain"
          data-lenis-prevent
        >
          {/* ─── Hero Section ─── */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden" data-reveal>
            <img
              src={project.heroImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <span className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-white/60 mb-3 block">
                {project.category}
              </span>
              <h2 className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-white tracking-wide leading-tight">
                {project.title}
              </h2>
            </div>
          </div>

          {/* ─── Project Details Bar ─── */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px"
            style={{ backgroundColor: `${project.textColor}10` }}
            data-reveal
          >
            {[
              { label: "Location", value: project.details.location },
              { label: "Area", value: project.details.area },
              { label: "Year", value: project.details.year },
              { label: "Style", value: project.details.style },
            ].map((detail) => (
              <div
                key={detail.label}
                className="p-4 md:p-6 text-center"
                style={{ backgroundColor: project.color }}
              >
                <span className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase opacity-50 block mb-1">
                  {detail.label}
                </span>
                <span className="font-serif italic text-sm md:text-base">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>

          {/* ─── Design Concept ─── */}
          <div className="px-6 md:px-16 py-12 md:py-20" data-reveal>
            <div className="max-w-2xl mx-auto text-center">
              <span className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase opacity-40 block mb-6">
                Design Concept
              </span>
              <h3 className="font-serif italic text-2xl md:text-4xl tracking-wide mb-6 leading-snug">
                &ldquo;{project.concept.headline}&rdquo;
              </h3>
              <div className="w-10 h-px mx-auto opacity-20 mb-6" style={{ backgroundColor: project.textColor }} />
              <p className="font-sans text-sm md:text-base leading-relaxed opacity-70">
                {project.concept.description}
              </p>
            </div>
          </div>

          {/* ─── Floorplan ─── */}
          <div className="px-6 md:px-16 pb-12 md:pb-16" data-reveal>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px opacity-20" style={{ backgroundColor: project.textColor }} />
              <span className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase opacity-50">
                Floor Plan
              </span>
            </div>
            <div className="relative aspect-[16/10] rounded-sm overflow-hidden bg-black/5 shadow-inner">
              <img
                src={project.floorplan}
                alt={`${project.title} – Floor Plan`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* ─── Perspectives Grid ─── */}
          <div className="px-6 md:px-16 pb-12 md:pb-16" data-reveal>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px opacity-20" style={{ backgroundColor: project.textColor }} />
              <span className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase opacity-50">
                Perspectives
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {project.perspectives.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-sm bg-black/5 shadow-inner group ${
                    i === 0 ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/3]"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${project.title} perspective ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                  <span className="absolute bottom-3 right-3 font-sans text-[9px] tracking-[0.2em] uppercase text-white/50 bg-black/20 px-2 py-1 rounded-sm backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Design Sections ─── */}
          {project.sections.map((section, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } border-t border-current/5`}
              data-reveal
            >
              <div className="md:w-1/2 relative aspect-[4/3] md:aspect-auto overflow-hidden">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-16">
                <span className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase opacity-40 mb-3 block">
                  Section {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="font-serif italic text-xl md:text-3xl tracking-wide mb-4 leading-snug">
                  {section.title}
                </h4>
                <div className="w-8 h-px opacity-15 mb-4" style={{ backgroundColor: project.textColor }} />
                <p className="font-sans text-sm md:text-base leading-relaxed opacity-65">
                  {section.description}
                </p>
              </div>
            </div>
          ))}

          {/* ─── Material Palette ─── */}
          <div className="px-6 md:px-16 py-12 md:py-16" data-reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-px opacity-20" style={{ backgroundColor: project.textColor }} />
              <span className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase opacity-50">
                Material Palette
              </span>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              {project.materials.map((mat, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-inner border border-current/10"
                    style={{ backgroundColor: mat.color }}
                  />
                  <span className="font-sans text-[9px] md:text-[10px] tracking-[0.15em] uppercase opacity-50">
                    {mat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Bottom CTA ─── */}
          <div
            className="flex items-center justify-center py-12 md:py-16 border-t"
            style={{ borderColor: `${project.textColor}15` }}
            data-reveal
          >
            <button
              onClick={handleClose}
              className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase opacity-50 hover:opacity-100 transition-opacity duration-300 flex items-center gap-3 cursor-pointer"
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
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
