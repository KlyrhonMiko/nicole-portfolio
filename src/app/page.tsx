"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import dynamic from "next/dynamic";

// Dynamically import Works3D to prevent loading heavy Three.js bundles and 4MB GLTF model on initial page mount.
const Works3D = dynamic(() => import("@/components/Works3D"), {
  ssr: false,
  loading: () => <div className="w-full h-[100svh] min-h-[500px] bg-[#4D342D]" />,
});

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [load3D, setLoad3D] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
    // Wait for the hero entrance animation (~2.5s) to finish before downloading the massive Three.js JS bundle
    setTimeout(() => {
      setLoad3D(true);
    }, 3000);
  }, []);

  // Also load the 3D bundle immediately if the user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setLoad3D(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#EDE7DB] text-[#4D342D] flex flex-col">
      {/* ── Loading Screen — covers everything until assets are ready ── */}
      {!isLoaded && <LoadingScreen onComplete={handleLoadComplete} />}

      <Navbar isLoaded={isLoaded} />

      <main className="flex-1 w-full flex flex-col">
        <Hero isLoaded={isLoaded} />
        
        {/* Render fallback manually until it's safe to fetch the heavy chunk */}
        {load3D ? (
          <Works3D />
        ) : (
          <div className="w-full h-[100svh] min-h-[500px] bg-[#4D342D]" />
        )}
        
        <Gallery />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
