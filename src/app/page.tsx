"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Works from "@/components/Works";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

// Dynamically import Works3D to prevent loading heavy Three.js bundles and 4MB GLTF model on initial page mount.
const Works3D = dynamic(() => import("@/components/Works3D"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#EDE7DB] text-[#4D342D] flex flex-col">
      <Navbar />

      <main className="flex-1 w-full flex flex-col">
        <Hero />
        {/* <Works /> */}
        <Works3D />
        <Gallery />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
