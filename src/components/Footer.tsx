"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        setLocalTime(formatter.format(new Date()));
      } catch (err) {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-[#EDE7DB] pt-8 pb-10 md:pt-12 md:pb-12 border-t border-[#4D342D]/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative z-10">
        
        {/* Left Side: Brand Name & Copyright */}
        <div className="flex flex-col gap-6 md:gap-8">
          <span className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-[#4D342D] tracking-wide lowercase">
            nicole
          </span>
          <div className="flex flex-col gap-2">
            <span className="text-[9px] md:text-[10px] uppercase font-sans tracking-[0.3em] text-[#4D342D]/40 block">
              Interior Designer
            </span>
            <p className="text-[9px] md:text-[10px] text-[#4D342D]/30 font-sans uppercase tracking-[0.3em] mt-1">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>

        {/* Center: Live Local Clock */}
        <div className="flex flex-col gap-3 pb-1 md:pb-2">
          <span className="text-[9px] md:text-[10px] uppercase font-sans tracking-[0.3em] text-[#4D342D]/40 block">
            Local Time (Manila, PH)
          </span>
          <span className="font-serif text-xl md:text-2xl text-[#4D342D] tracking-wider italic">
            {localTime || "--:-- --"}
          </span>
        </div>

        {/* Right Side: Back to Top */}
        <div className="pb-1 md:pb-2">
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-4 cursor-pointer text-[#4D342D] hover:text-[#4D342D]/60 transition-colors duration-500"
            aria-label="Scroll to top"
          >
            <span className="text-[9px] md:text-[10px] font-sans uppercase tracking-[0.3em]">
              Back to Top
            </span>
            <div className="w-8 h-8 rounded-full border border-[#4D342D]/20 group-hover:border-[#4D342D]/40 flex items-center justify-center transition-colors duration-500">
              <ArrowUp className="w-3.5 h-3.5 transition-transform duration-500 group-hover:-translate-y-1" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
}
