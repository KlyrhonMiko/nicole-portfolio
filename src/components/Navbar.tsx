"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTheme } from "next-themes";
import { useLenis } from "lenis/react";

interface NavbarProps {
  isLoaded?: boolean;
}

export default function Navbar({ isLoaded = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const lenis = useLenis();
  
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const navEntranceTl = useRef<gsap.core.Timeline | null>(null);
  const hasPlayedRef = useRef(false);

  const navItems = [
    { label: "Works", id: "works-3d" },
    { label: "Gallery", id: "gallery" },
    { label: "Contact", id: "contact" },
  ];

  // Build entrance animation (paused) — plays when isLoaded becomes true
  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      navEntranceTl.current = tl;

      // Stagger each nav element — delay synced with hero timeline
      tl.fromTo(
        ".nav-logo-first",
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.8 }
      );

      tl.fromTo(
        ".nav-logo-separator",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.5, ease: "power2.inOut" },
        "-=0.35"
      );

      tl.fromTo(
        ".nav-logo-second",
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.35"
      );

      tl.fromTo(
        ".nav-link",
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.09 },
        "-=0.4"
      );

      tl.fromTo(
        ".nav-menu-btn",
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        "-=0.3"
      );
    },
    { scope: navRef }
  );

  // Play navbar entrance when loading completes
  useEffect(() => {
    if (!isLoaded || hasPlayedRef.current || !navEntranceTl.current) return;
    hasPlayedRef.current = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        navEntranceTl.current?.play();
      });
    });
  }, [isLoaded]);

  // Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.2) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Full-screen overlay menu animation
  const openMenu = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";

    // Animate after React renders the overlay
    requestAnimationFrame(() => {
      if (!overlayRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      menuTl.current = tl;

      // Curtain reveal — two panels slide from edges
      tl.fromTo(
        ".menu-panel-left",
        { x: "-100%" },
        { x: "0%", duration: 0.8 }
      );

      tl.fromTo(
        ".menu-panel-right",
        { x: "100%" },
        { x: "0%", duration: 0.8 },
        "<"
      );

      // Decorative center line draws down
      tl.fromTo(
        ".menu-center-line",
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.6, ease: "power2.inOut" },
        "-=0.3"
      );

      // Menu items stagger in
      tl.fromTo(
        ".menu-item",
        { y: 60, opacity: 0, rotateX: -15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.3"
      );

      // Bottom info
      tl.fromTo(
        ".menu-footer-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
        "-=0.5"
      );

      // Close button
      tl.fromTo(
        ".menu-close-btn",
        { rotate: -90, opacity: 0 },
        { rotate: 0, opacity: 1, duration: 0.5 },
        "-=0.6"
      );
    });
  }, []);

  const closeMenu = useCallback(() => {
    if (!overlayRef.current) {
      setIsOpen(false);
      document.body.style.overflow = "unset";
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.in" },
      onComplete: () => {
        setIsOpen(false);
        document.body.style.overflow = "unset";
      },
    });

    tl.to(".menu-item", {
      y: -40,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
    });

    tl.to(
      ".menu-footer-item",
      { y: -20, opacity: 0, duration: 0.3, stagger: 0.03 },
      "-=0.2"
    );

    tl.to(
      ".menu-center-line",
      { scaleY: 0, opacity: 0, duration: 0.3 },
      "-=0.2"
    );

    tl.to(".menu-panel-left", { x: "-100%", duration: 0.6 }, "-=0.1");
    tl.to(".menu-panel-right", { x: "100%", duration: 0.6 }, "<");
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    const wasOpen = isOpen;
    closeMenu();

    const performScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        if (lenis) {
          lenis.scrollTo(`#${id}`, { offset: 0, duration: 1.2 });
        } else {
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          window.scrollTo({
            top: elementPosition,
            behavior: "smooth",
          });
        }
      }
    };

    if (wasOpen) {
      setTimeout(performScroll, 400);
    } else {
      performScroll();
    }
  };

  return (
    <>
      {/* ── Main Navigation Bar — transparent floating overlay ── */}
      <header
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 py-5 sm:py-7 bg-transparent pointer-events-none"
      >
        <div className="w-full px-6 sm:px-10 md:px-14 flex items-center justify-between pointer-events-auto">
          {/* Logo — editorial split style */}
          <a
            href="#"
            className="group flex items-center gap-0 select-none"
            aria-label="Home"
          >
            {/* First name */}
            <span
              className="nav-logo-first font-serif text-[15px] sm:text-[17px] tracking-[0.18em] uppercase opacity-0 transition-colors duration-700 text-[#EDE7DB] drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
            >
              Nicole
            </span>

            {/* Separator dot */}
            <span
              className="nav-logo-separator inline-block w-[3px] h-[3px] rounded-full mx-3 sm:mx-4 opacity-0 origin-center transition-colors duration-700 bg-[#DDCCB7]/50"
            />

            {/* Discipline */}
            <span
              className="nav-logo-second font-sans text-[9px] sm:text-[10px] tracking-[0.35em] uppercase font-light opacity-0 transition-colors duration-700 text-[#DDCCB7]/60 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
            >
              Interior Designer
            </span>
          </a>

          {/* Desktop Nav Links — minimal, editorial */}
          <nav className="hidden md:flex items-center gap-0">
            {navItems.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className="nav-link relative px-5 lg:px-7 py-2 opacity-0 group transition-colors duration-500"
              >
                {/* Index number — editorial */}
                <span
                  className="absolute -top-1 left-3 lg:left-5 text-[8px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 text-[#DDCCB7]/40"
                >
                  0{i + 1}
                </span>

                {/* Label */}
                <span
                  className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-light transition-colors duration-500 text-[#EDE7DB]/50 group-hover:text-[#EDE7DB] drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                >
                  {item.label}
                </span>

                {/* Underline reveal */}
                <span
                  className="absolute bottom-1 left-5 lg:left-7 right-5 lg:right-7 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out bg-[#DDCCB7]/30"
                />
              </a>
            ))}

            {/* Thin vertical separator */}
            <span
              className="nav-link w-px h-4 mx-3 opacity-0 transition-colors duration-500 bg-[#DDCCB7]/15"
            />


            {/* Menu trigger on desktop too — for luxury sites this is common */}
            <button
              onClick={openMenu}
              className="nav-link opacity-0 flex items-center gap-2 group py-2 pl-2 cursor-pointer"
              aria-label="Open menu"
            >
              <span
                className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-light transition-colors duration-500 text-[#EDE7DB]/50 group-hover:text-[#EDE7DB] drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
              >
                Menu
              </span>
              {/* Animated hamburger — two thin lines */}
              <div className="flex flex-col gap-[5px] w-5 overflow-hidden">
                <span
                  className="block h-px w-full transition-all duration-500 origin-right group-hover:w-3/4 bg-[#DDCCB7]/50"
                />
                <span
                  className="block h-px w-3/4 transition-all duration-500 origin-right group-hover:w-full bg-[#DDCCB7]/50"
                />
              </div>
            </button>
          </nav>

          <div className="flex items-center gap-2 md:hidden">

            {/* Mobile Menu Button */}
            <button
              onClick={openMenu}
              className="nav-menu-btn opacity-0 flex items-center gap-2 group py-2 pl-1 cursor-pointer"
              aria-label="Open menu"
            >
            <span
              className="text-[10px] tracking-[0.25em] uppercase font-light transition-colors duration-500 text-[#EDE7DB]/50 group-hover:text-[#EDE7DB] drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
            >
              Menu
            </span>
            <div className="flex flex-col gap-[4px] w-4">
              <span
                className="block h-px w-full transition-all duration-300 bg-[#DDCCB7]/50"
              />
              <span
                className="block h-px w-2/3 transition-all duration-300 bg-[#DDCCB7]/50"
              />
            </div>
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-Screen Overlay Menu ── */}
      {isOpen && (
        <div ref={overlayRef} className="fixed inset-0 z-[60]">
          {/* Two-panel background for curtain effect */}
          <div className="menu-panel-left absolute top-0 left-0 w-1/2 h-full bg-[#4D342D]" />
          <div className="menu-panel-right absolute top-0 right-0 w-1/2 h-full bg-[#4D342D]" />

          {/* Decorative center vertical line */}
          <div className="menu-center-line absolute left-1/2 top-[15%] bottom-[15%] w-px bg-[#DDCCB7]/10 origin-top opacity-0 pointer-events-none" />

          {/* Close button — top right */}
          <button
            onClick={closeMenu}
            className="menu-close-btn absolute top-6 sm:top-8 right-6 sm:right-10 md:right-14 z-30 flex items-center gap-3 group cursor-pointer opacity-0"
            aria-label="Close menu"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#DDCCB7]/40 group-hover:text-[#DDCCB7]/80 transition-colors duration-500 font-light">
              Close
            </span>
            {/* Elegant X — two crossing lines */}
            <div className="relative w-5 h-5">
              <span className="absolute top-1/2 left-0 w-full h-px bg-[#DDCCB7]/50 rotate-45 group-hover:bg-[#DDCCB7] transition-colors duration-500" />
              <span className="absolute top-1/2 left-0 w-full h-px bg-[#DDCCB7]/50 -rotate-45 group-hover:bg-[#DDCCB7] transition-colors duration-500" />
            </div>
          </button>

          {/* Menu Content */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center px-6 sm:px-10 md:px-20">
            {/* Navigation Items */}
            <nav className="flex flex-col items-center gap-4 sm:gap-6">
              {navItems.map((item, i) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className="menu-item group flex items-center gap-5 sm:gap-8 opacity-0 cursor-pointer"
                  style={{ perspective: "600px" }}
                >
                  {/* Index */}
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-[#DDCCB7]/25 group-hover:text-[#DDCCB7]/60 transition-colors duration-500 w-8 text-right">
                    0{i + 1}
                  </span>

                  {/* Thin line */}
                  <span className="w-6 sm:w-10 h-px bg-[#DDCCB7]/15 group-hover:bg-[#DDCCB7]/40 group-hover:w-14 transition-all duration-500" />

                  {/* Label */}
                  <span className="font-serif text-[clamp(2.2rem,6vw,5rem)] leading-none tracking-[0.06em] text-[#EDE7DB]/85 group-hover:text-[#EDE7DB] transition-all duration-500 capitalize group-hover:tracking-[0.1em]">
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>

            {/* Bottom bar */}
            <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-10 md:left-14 right-6 sm:right-10 md:right-14 flex items-end justify-between">
              {/* Social links */}
              <div className="menu-footer-item flex items-center gap-6 opacity-0">
                <a
                  href="#"
                  className="text-[9px] tracking-[0.25em] uppercase text-[#DDCCB7]/30 hover:text-[#DDCCB7]/70 transition-colors duration-500 font-light"
                >
                  Instagram
                </a>
                <span className="w-px h-3 bg-[#DDCCB7]/10" />
                <a
                  href="#"
                  className="text-[9px] tracking-[0.25em] uppercase text-[#DDCCB7]/30 hover:text-[#DDCCB7]/70 transition-colors duration-500 font-light"
                >
                  LinkedIn
                </a>
                <span className="w-px h-3 bg-[#DDCCB7]/10" />
                <a
                  href="mailto:hello@nicoleinteriors.com"
                  className="text-[9px] tracking-[0.25em] uppercase text-[#DDCCB7]/30 hover:text-[#DDCCB7]/70 transition-colors duration-500 font-light"
                >
                  Email
                </a>
              </div>

              {/* Copyright */}
              <span className="menu-footer-item text-[8px] tracking-[0.3em] uppercase text-[#DDCCB7]/20 font-light opacity-0 hidden sm:block">
                © {new Date().getFullYear()} Nicole Airish Moran
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
