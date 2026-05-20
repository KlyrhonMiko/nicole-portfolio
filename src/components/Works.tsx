"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const worksData = [
  {
    id: "la-residence",
    title: "Laurel Canyon Residence",
    category: "Residential",
    year: "2023",
    location: "Los Angeles, CA",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "nomad-cafe",
    title: "Nomad Coffee Roasters",
    category: "Commercial",
    year: "2024",
    location: "Portland, OR",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "alpine-retreat",
    title: "Alpine Boutique Hotel",
    category: "Hospitality",
    year: "2022",
    location: "Aspen, CO",
    image:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "soho-loft",
    title: "SoHo Artist Loft",
    category: "Residential",
    year: "2023",
    location: "New York, NY",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "verde-restaurant",
    title: "Verde Fine Dining",
    category: "Hospitality",
    year: "2024",
    location: "San Francisco, CA",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "creative-studio",
    title: "Kinship Creative Studio",
    category: "Commercial",
    year: "2022",
    location: "Austin, TX",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
  },
];

export default function Works() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Section heading — masked reveal
      gsap.fromTo(
        ".works-title-word",
        { y: "110%" },
        {
          y: "0%",
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".works-header-block",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Decorative line
      gsap.fromTo(
        ".works-accent-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.0,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".works-header-block",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // Subtitle label
      gsap.fromTo(
        ".works-subtitle",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".works-header-block",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // Each project card — image reveal + info
      document.querySelectorAll(".project-card").forEach((card) => {
        const img = card.querySelector(".project-image-wrap");
        const info = card.querySelector(".project-info");

        if (img) {
          gsap.fromTo(
            img,
            { clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.2,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }

        if (info) {
          gsap.fromTo(
            info,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 70%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });

      // Parallax on images
      document.querySelectorAll(".project-image-inner").forEach((img) => {
        gsap.to(img, {
          y: "-8%",
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".project-card"),
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="works"
      ref={containerRef}
      className="relative py-28 md:py-40 overflow-hidden bg-[#4D342D]"
    >
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* ── Section Header ── */}
        <div className="works-header-block mb-20 md:mb-28">
          <p className="works-subtitle font-sans text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.55em] uppercase text-[#DDCCB7]/40 font-light mb-6 opacity-0">
            Selected Works
          </p>

          <div className="overflow-hidden">
            <h2 className="works-title-word font-serif italic text-[clamp(3rem,10vw,7rem)] leading-[0.9] text-[#DDCCB7] font-light lowercase tracking-tight">
              portfolio
            </h2>
          </div>

          <div className="works-accent-line w-24 h-px bg-[#DDCCB7]/30 mt-8 origin-left" />
        </div>

        {/* ── Project Showcase ── alternating full-view layout */}
        <div className="space-y-24 md:space-y-36">
          {worksData.map((work, i) => {
            const isEven = i % 2 === 0;

            return (
              <article
                key={work.id}
                className="project-card group cursor-pointer"
              >
                <div
                  className={`flex flex-col ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-8 md:gap-12 lg:gap-16 items-start`}
                >
                  {/* ── Image ── */}
                  <div className="w-full md:w-[60%] lg:w-[62%] flex-shrink-0">
                    <div className="project-image-wrap relative aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={work.image}
                        alt={work.title}
                        className="project-image-inner w-full h-[115%] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />

                      {/* Subtle vignette overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#4D342D]/30 via-transparent to-transparent pointer-events-none" />

                      {/* Hover CTA */}
                      <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                        <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#EDE7DB]/80">
                          View Project
                        </span>
                        <div className="w-8 h-8 rounded-full border border-[#EDE7DB]/30 flex items-center justify-center backdrop-blur-sm bg-[#EDE7DB]/5">
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#EDE7DB]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Info ── */}
                  <div
                    className={`project-info w-full md:w-[40%] lg:w-[38%] flex flex-col justify-end md:py-8 ${
                      isEven ? "md:items-start" : "md:items-end md:text-right"
                    }`}
                  >
                    {/* Index */}
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#DDCCB7]/20 mb-4 block">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Title */}
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#EDE7DB]/90 tracking-wide leading-tight mb-5 group-hover:text-[#EDE7DB] transition-colors duration-500">
                      {work.title}
                    </h3>

                    {/* Thin accent */}
                    <div
                      className={`w-10 h-px bg-[#DDCCB7]/20 mb-6 group-hover:w-16 transition-all duration-700 ${
                        isEven ? "origin-left" : "origin-right"
                      }`}
                    />

                    {/* Meta */}
                    <div
                      className={`flex items-center gap-4 flex-wrap ${
                        isEven ? "" : "md:justify-end"
                      }`}
                    >
                      <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#DDCCB7]/35 group-hover:text-[#DDCCB7]/60 transition-colors duration-500">
                        {work.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#DDCCB7]/15" />
                      <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#DDCCB7]/25 group-hover:text-[#DDCCB7]/50 transition-colors duration-500">
                        {work.location}
                      </span>
                    </div>

                    {/* Year — standalone, editorial */}
                    <span className="font-serif italic text-[#DDCCB7]/15 text-5xl lg:text-6xl mt-8 md:mt-12 select-none leading-none group-hover:text-[#DDCCB7]/25 transition-colors duration-700">
                      {work.year}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
