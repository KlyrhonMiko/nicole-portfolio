"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SWATCHES = [
  {
    id: "cover",
    title: "Portfolio",
    category: "Selected Works",
    src: "",
    color: "#D1C7B8",
    textColor: "#4D342D",
    isCover: true
  },
  {
    id: 1,
    title: "Serene Living",
    category: "Interior",
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85",
    color: "#4D342D",
    textColor: "#E5E0D8"
  },
  {
    id: 2,
    title: "Carrara Kitchen",
    category: "Interior",
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=85",
    color: "#E5E0D8",
    textColor: "#4D342D"
  },
  {
    id: 3,
    title: "Golden Hour Suite",
    category: "Interior",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=85",
    color: "#8C9485",
    textColor: "#1A1410"
  },
  {
    id: 4,
    title: "Dusk Facade",
    category: "Exterior",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85",
    color: "#4A5254",
    textColor: "#E5E0D8"
  },
  {
    id: 5,
    title: "Stillwater Bath",
    category: "Interior",
    src: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1000&q=85",
    color: "#B58C70",
    textColor: "#1A1410"
  },
  {
    id: 6,
    title: "Retro Revival",
    category: "Interior",
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85",
    color: "#1A1410",
    textColor: "#E5E0D8"
  },
  {
    id: 7,
    title: "Minimalist Lounge",
    category: "Interior",
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=85",
    color: "#C2B29F",
    textColor: "#4D342D"
  }
];

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const swatchesRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const swatches = swatchesRef.current.filter(Boolean);
      if (swatches.length === 0) return;

      const tl = gsap.timeline();

      // Sequentially swing each card out of the way to reveal the one beneath it
      swatches.forEach((swatch, i) => {
        if (i === swatches.length - 1) return; // The very last card stays in place

        // Target angle increased past 90 so it swings upwards, plus a staggered fan
        const targetAngle = 105 - (i * 4);

        tl.to(
          swatch,
          {
            rotation: targetAngle,
            ease: "none",
            duration: 1,
            force3D: true
          }
        )
          // Add a pause so the user can view the revealed card before it swings away
          .to({}, { duration: 0.8 });
      });

      ScrollTrigger.create({
        animation: tl,
        trigger: containerRef.current,
        start: "top top",
        end: "+=4000", // Long scroll to accommodate the sequential pauses
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      });

    },
    { scope: sectionRef }
  );

  return (
    <section id="gallery" ref={sectionRef} className="relative bg-[#EDE7DB]">
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden flex items-center justify-end pr-8 md:pr-24 lg:pr-40"
      >
        {/* Background Typography */}
        <div className="absolute inset-0 flex flex-col items-start justify-center pl-8 md:pl-24 pointer-events-none z-0 opacity-10">
          <h2 className="font-serif italic text-[18vw] text-[#4D342D] tracking-tighter leading-none">
            gallery
          </h2>
        </div>

        {/* Swatch Stack Container */}
        <div
          className="relative z-10 h-[75vh] md:h-[80vh] lg:h-[85vh] aspect-[3/4] max-w-[90vw] max-h-[90vh] -rotate-2"
        >
          {SWATCHES.map((swatch, i) => (
            <div
              key={swatch.id}
              ref={el => { swatchesRef.current[i] = el; }}
              className="absolute inset-0 shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-sm flex flex-col will-change-transform border border-black/5 transform-gpu"
              style={{
                backgroundColor: swatch.color,
                color: swatch.textColor,
                transformOrigin: "calc(100% - 32px) 32px", // Pivot at top right
                zIndex: SWATCHES.length - i,
                backfaceVisibility: "hidden"
              }}
            >
              {/* The Pin */}
              <div className="absolute top-[16px] right-[16px] md:top-[24px] md:right-[24px] w-6 h-6 rounded-full bg-[#1A1410] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center z-20">
                <div className="w-full h-px bg-white/20 transform rotate-45" />
              </div>

              {swatch.isCover ? (
                // Cover Design
                <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center border-2 border-transparent">
                  <span className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase opacity-50 mb-6 lg:mb-8">
                    {swatch.category}
                  </span>
                  <h3 className="font-serif italic text-4xl md:text-5xl lg:text-6xl tracking-wide leading-tight mb-8 lg:mb-10">
                    {swatch.title}
                  </h3>
                  <div className="w-12 h-px bg-current opacity-20" />
                  <span className="mt-8 font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase opacity-40">
                    Made to Measure
                  </span>
                </div>
              ) : (
                // Content Card Design
                <div className="flex-1 flex flex-col p-3 md:p-5 pt-[50px] md:pt-[64px]">
                  {/* Image */}
                  <div className="flex-1 relative overflow-hidden mb-3 md:mb-4 bg-black/5 rounded-sm shadow-inner group cursor-pointer">
                    <img
                      src={swatch.src}
                      alt={swatch.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  {/* Details */}
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase opacity-60 mb-2 block">
                        {swatch.category} — {String(i).padStart(2, '0')}
                      </span>
                      <h3 className="font-serif text-lg md:text-2xl italic tracking-wide">
                        {swatch.title}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none z-0">
          <p className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#6A6A53]/60">
            Scroll to unroll
          </p>
          <div className="w-px h-12 md:h-16 bg-gradient-to-b from-[#6A6A53]/40 to-transparent mx-auto mt-4" />
        </div>
      </div>
    </section>
  );
}
