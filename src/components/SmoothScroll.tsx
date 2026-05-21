"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // 1. Synchronize Lenis raf loop with the central GSAP ticker
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    // 2. Let ScrollTrigger update on every smooth scroll step
    const handleScroll = () => {
      ScrollTrigger.update();
    };

    const lenisInstance = lenisRef.current?.lenis;
    if (lenisInstance) {
      lenisInstance.on("scroll", handleScroll);
    }

    return () => {
      gsap.ticker.remove(update);
      if (lenisInstance) {
        lenisInstance.off("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      autoRaf={false} // Disable Lenis's built-in requestAnimationFrame to avoid frame conflict
      root
      options={{
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        syncTouch: true,        // Enables smooth touch scrolling on mobile via lerp sync
        syncTouchLerp: 0.075,   // Lower = smoother but slightly delayed; 0.075 is a good mobile feel
        touchInertiaMultiplier: 25, // Natural momentum/inertia after a swipe
        touchMultiplier: 1.8,   // Amplify touch delta so swiping doesn't feel sluggish
        gestureOrientation: "vertical",
      }}
    >
      {children}
    </ReactLenis>
  );
}
