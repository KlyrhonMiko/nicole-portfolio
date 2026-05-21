"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".contact-header-block",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        ".contact-subtitle",
        { opacity: 0 },
        { opacity: 1, duration: 1.0, ease: "power2.out" }
      )
        .fromTo(
          ".contact-title-word",
          { y: "110%" },
          { y: "0%", duration: 1.2, ease: "power4.out" },
          "-=0.5"
        )
        .fromTo(
          ".contact-accent-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.0, ease: "power2.inOut" },
          "-=0.8"
        );

      gsap.fromTo(
        ".info-card-wrap",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".info-card-wrap",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-28 md:py-40 overflow-hidden bg-[#EDE7DB]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">

        {/* ── Section Header ── */}
        <div className="contact-header-block mb-16 md:mb-24 flex flex-col items-center">
          <p className="contact-subtitle font-sans text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.55em] uppercase text-[#4D342D]/40 font-light mb-6 opacity-0">
            Inquiries
          </p>

          <div className="overflow-hidden px-6 -mx-6">
            <h2 className="contact-title-word font-serif italic text-[clamp(3rem,10vw,7rem)] leading-[0.9] text-[#4D342D] font-light lowercase tracking-tight">
              connect
            </h2>
          </div>

          <div className="contact-accent-line w-24 h-px bg-[#4D342D]/30 mt-8 origin-center" />
        </div>

        <div className="w-full flex justify-center">

          {/* Information Block */}
          <div className="info-card-wrap space-y-16 max-w-3xl">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-serif text-[#4D342D] tracking-wide">
                Start Your Design Journey
              </h3>

              <p className="text-[#4D342D]/70 leading-relaxed font-light text-sm md:text-base mx-auto max-w-xl">
                Whether you are looking to redesign a single room or embark on a full-scale renovation, I would love to hear about your vision. Please reach out to schedule an initial consultation.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 pt-12 border-t border-[#4D342D]/10">
              {/* Info Item 1 */}
              <div>
                <span className="block text-[9px] uppercase font-sans tracking-[0.3em] text-[#4D342D]/40 mb-3">
                  Email
                </span>
                <a
                  href="mailto:nicoleairishmoran@gmail.com"
                  className="text-[#4D342D] hover:text-[#4D342D]/70 font-serif text-xl md:text-2xl transition-colors italic"
                >
                  nicoleairishmoran@gmail.com
                </a>
              </div>

              {/* Info Item 2 */}
              <div>
                <span className="block text-[9px] uppercase font-sans tracking-[0.3em] text-[#4D342D]/40 mb-3">
                  Phone
                </span>
                <span className="text-[#4D342D] font-serif text-xl md:text-2xl italic">
                  +63 995 0736 357
                </span>
              </div>
            </div>

            {/* Socials Connection */}
            <div className="pt-12 space-y-5 flex flex-col items-center">
              <span className="text-[9px] uppercase font-sans tracking-[0.3em] text-[#4D342D]/40 block">
                Follow Along
              </span>
              <div className="flex gap-8">
                <a href="#" className="text-[#4D342D] hover:text-[#4D342D]/60 transition-colors">
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a href="#" className="text-[#4D342D] hover:text-[#4D342D]/60 transition-colors">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

