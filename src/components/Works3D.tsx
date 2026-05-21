"use client";

import { useRef, useState, Suspense, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls, Environment, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Suppress THREE.Clock deprecation warning from third-party libraries (R3F, Drei, etc.)
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0] &&
      typeof args[0] === "string" &&
      args[0].includes("THREE.Clock")
    ) {
      return;
    }
    originalWarn(...args);
  };
}

// Preload the downloaded sample interior model
useGLTF.preload("/models/interior.glb");

// Data structure for multiple works/models
const WORKS = [
  {
    id: "work-1",
    title: "Laurel Canyon",
    modelUrl: "/models/interior.glb",
    scale: 0.015,
    position: [0, 0, 0] as [number, number, number],
    pois: [
      { id: "living-room", title: "Living Room", position: [-1.5, 0.5, -1], lookAt: [-1, 0.8, -0.5] },
      { id: "office", title: "Office", position: [1.8, 0.5, 0.8], lookAt: [1.2, 0.8, 0.2] },
      { id: "kitchen", title: "Kitchen", position: [-0.2, 0.5, 2.5], lookAt: [-0.2, 0.8, 1.8] },
    ]
  },
  {
    id: "work-2",
    title: "Alpine Hotel",
    modelUrl: "/models/interior.glb", // Using same sample for now, client can replace
    scale: 0.015,
    position: [0, 0, 0] as [number, number, number],
    pois: [
      { id: "lobby", title: "Main Lobby", position: [0, 0.5, 2], lookAt: [0, 0.8, 0] },
      { id: "suite", title: "Suite 101", position: [-2, 1.5, -1], lookAt: [-1, 1.5, -1] }
    ]
  },
  {
    id: "work-3",
    title: "Nomad Cafe",
    modelUrl: "/models/interior.glb", // Using same sample for now, client can replace
    scale: 0.015,
    position: [0, 0, 0] as [number, number, number],
    pois: [
      { id: "bar", title: "Coffee Bar", position: [1, 0.5, 1], lookAt: [0, 0.5, 0] },
      { id: "seating", title: "Lounge", position: [-1, 0.5, 2], lookAt: [0, 0.5, 1] }
    ]
  }
];

// Helper to calculate infinite-scrolling X coordinates dynamically
const getModelX = (modelIndex: number, currentVirtualIndex: number, totalModels: number) => {
  const offsetFactor = Math.round((currentVirtualIndex - modelIndex) / totalModels);
  const virtualIndex = offsetFactor * totalModels + modelIndex;
  return virtualIndex * 30;
};

function Model({ modelUrl, scale, position }: { modelUrl: string, scale: number, position: [number, number, number] }) {
  const { scene } = useGLTF(modelUrl);
  
  // Clone the scene so that multiple instances of the same model can be rendered simultaneously.
  // useMemo ensures cloning only happens when the scene object itself changes.
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <Center position={position}>
      <primitive 
        object={clonedScene} 
        scale={scale} 
      />
    </Center>
  );
}

export default function Works3D() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(false);
  const controlsRef = useRef<CameraControls>(null);
  
  // Track mobile layout for responsive camera distance
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper for responsive camera distance
  const getCamDist = () => isMobile ? 18 : 10;
  
  // Track the continuous virtual index for 3D layout and camera panning
  const [virtualIndex, setVirtualIndex] = useState(0);

  // Track the work index currently displayed in the text overlay
  const [displayWorkIndex, setDisplayWorkIndex] = useState(0);
  
  // Track the current active POI within the active project
  const [activePoi, setActivePoi] = useState<string | null>(null);

  // State to manage model switching transitions (primarily for text overlays)
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeWork = WORKS[displayWorkIndex];

  // Enable/disable rendering based on viewport visibility to save huge GPU overhead
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting);
      },
      {
        rootMargin: "200px", // Trigger 200px before scrolling in, so it's fully loaded when visible
        threshold: 0.01
      }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleWorkSwitch = (nextVirtualIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Update virtual index instantly so the camera starts panning and models reposition
    setVirtualIndex(nextVirtualIndex);

    const offsetX = nextVirtualIndex * 30;
    if (controlsRef.current) {
      const dist = getCamDist();
      // Smoothly pan camera to the new model's position
      controlsRef.current.setLookAt(
        offsetX, dist, dist, // Target camera position
        offsetX, 0, 0,       // Target camera lookAt
        true                 // Enable smooth transition
      );
    }

    // Fade out text overlays and switch information midway
    setTimeout(() => {
      const nextWorkIndex = (nextVirtualIndex % WORKS.length + WORKS.length) % WORKS.length;
      setDisplayWorkIndex(nextWorkIndex);
      setActivePoi(null);

      // Fade back in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 350); // Matches the fade-out duration of text overlays (350ms)
  };

  const handleNextWork = () => {
    handleWorkSwitch(virtualIndex + 1);
  };

  const handlePrevWork = () => {
    handleWorkSwitch(virtualIndex - 1);
  };

  const handlePoiClick = (poi: any) => {
    if (isTransitioning) return;
    setActivePoi(poi.id);
    if (controlsRef.current) {
      const offsetX = virtualIndex * 30;
      // Smoothly animate the camera down to the "walkthrough" perspective relative to the active model
      controlsRef.current.setLookAt(
        poi.position[0] + 1.5 + offsetX,
        poi.position[1] + 1.5,
        poi.position[2] + 2, 
        poi.lookAt[0] + offsetX,
        poi.lookAt[1],
        poi.lookAt[2],
        true
      );
    }
  };

  const resetCamera = () => {
    if (isTransitioning) return;
    setActivePoi(null);
    if (controlsRef.current) {
      const offsetX = virtualIndex * 30;
      const dist = getCamDist();
      // Reset to Bird's Eye View of the active model
      controlsRef.current.setLookAt(
        offsetX, dist, dist, // High up, looking down
        offsetX, 0, 0,       // Looking at the center of the active model
        true
      );
    }
  };

  // Enable keyboard navigation (ArrowLeft/ArrowRight) only when the section is in view
  useEffect(() => {
    if (!inViewport) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === "ArrowRight") {
        handleNextWork();
      } else if (e.key === "ArrowLeft") {
        handlePrevWork();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [virtualIndex, isTransitioning, inViewport]);

  return (
    <section id="works-3d" ref={sectionRef} className="relative w-full h-[100svh] min-h-[500px] bg-[#4D342D] overflow-hidden" style={{ touchAction: "pan-y" }}>
      
      {/* 3D Canvas - Pointer events none ensures normal page scrolling passes right through to Lenis */}
      <div className="absolute inset-0 pointer-events-none" style={{ touchAction: "none" }}>
        {inViewport && (
          <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, isMobile ? 18 : 10, isMobile ? 18 : 10], fov: 45 }}>
            <CameraControls 
              ref={controlsRef} 
              // Disable all manual user interactions so it acts purely as a backdrop
              mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
              touches={{ one: 0, two: 0, three: 0 }}
            />
            <Suspense fallback={null}>
              <Environment preset="city" />
              <ambientLight intensity={0.6} />
              <directionalLight position={[8, 12, 6]} intensity={1.2} castShadow />

              {WORKS.map((work, idx) => (
                <Model 
                  key={work.id} 
                  modelUrl={work.modelUrl} 
                  scale={work.scale} 
                  position={[getModelX(idx, virtualIndex, WORKS.length), work.position[1], work.position[2]]} 
                />
              ))}
            </Suspense>
          </Canvas>
        )}
      </div>


      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-start z-10 p-4 sm:p-6 md:p-12">
        
        {/* Title */}
        <div className={`absolute top-6 left-6 sm:left-10 md:top-12 md:left-24 max-w-[60%] sm:max-w-none flex flex-col items-start transition-all duration-350 ease-in-out ${
          isTransitioning ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
        }`}>
          <h2 className="font-serif italic text-2xl sm:text-3xl md:text-5xl text-[#EDE7DB] tracking-wide flex items-center flex-wrap">
            works 
            <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-[#DDCCB7]/50 not-italic ml-3 sm:ml-4 align-middle">
              {displayWorkIndex + 1} / {WORKS.length}
            </span>
          </h2>
          <p className="font-sans text-[10px] sm:text-xs md:text-sm tracking-widest text-[#DDCCB7] uppercase mt-1 sm:mt-2">
            {activeWork.title}
          </p>
        </div>

        {/* Selection Menu — bottom-center on mobile, right-center on desktop */}
        <div className={`absolute left-1/2 -translate-x-1/2 bottom-16 md:left-auto md:translate-x-0 md:right-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 flex flex-row md:flex-col items-center md:items-end gap-4 sm:gap-5 md:gap-6 transition-all duration-350 ease-in-out ${
          isTransitioning ? "opacity-0 translate-y-4 md:translate-y-0 md:translate-x-4 pointer-events-none" : "opacity-100 translate-y-0 md:translate-x-0 pointer-events-auto"
        }`}>
          <button
            onClick={resetCamera}
            className={`group flex items-center md:justify-end gap-2 md:gap-4 transition-all duration-500 cursor-pointer ${
              activePoi === null ? "opacity-100" : "opacity-40 hover:opacity-80"
            }`}
          >
            <span className="font-sans text-[10px] sm:text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-[#EDE7DB]">
              Master Plan
            </span>
            <span className={`hidden md:block h-[1px] transition-all duration-500 ${activePoi === null ? "bg-[#DDCCB7] w-12" : "bg-[#DDCCB7]/30 w-6 group-hover:w-10 group-hover:bg-[#DDCCB7]/60"}`}></span>
            <span className={`block md:hidden w-full h-[1px] transition-all duration-500 ${activePoi === null ? "bg-[#DDCCB7]" : "bg-[#DDCCB7]/30"}`}></span>
          </button>

          {activeWork.pois.map((poi) => (
            <button
              key={poi.id}
              onClick={() => handlePoiClick(poi)}
              className={`group flex items-center md:justify-end gap-2 md:gap-4 transition-all duration-500 cursor-pointer ${
                activePoi === poi.id ? "opacity-100" : "opacity-40 hover:opacity-80"
              }`}
            >
              <span className="font-sans text-[10px] sm:text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-[#EDE7DB]">
                {poi.title}
              </span>
              <span className={`hidden md:block h-[1px] transition-all duration-500 ${activePoi === poi.id ? "bg-[#DDCCB7] w-12" : "bg-[#DDCCB7]/30 w-6 group-hover:w-10 group-hover:bg-[#DDCCB7]/60"}`}></span>
              <span className={`block md:hidden w-full h-[1px] transition-all duration-500 ${activePoi === poi.id ? "bg-[#DDCCB7]" : "bg-[#DDCCB7]/30"}`}></span>
            </button>
          ))}
        </div>

        {/* Navigation Arrows - Middle Left & Middle Right */}
        <button 
          onClick={handlePrevWork}
          className={`absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 pointer-events-auto z-20 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-[#4D342D]/40 backdrop-blur-sm text-[#DDCCB7]/50 hover:text-[#EDE7DB] hover:scale-105 active:scale-95 transition-all duration-300 ${
            isTransitioning ? "opacity-20 cursor-not-allowed pointer-events-none" : "cursor-pointer"
          }`}
          aria-label="Previous Work"
          disabled={isTransitioning}
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={1.5} />
        </button>

        <button 
          onClick={handleNextWork}
          className={`absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 pointer-events-auto z-20 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-[#4D342D]/40 backdrop-blur-sm text-[#DDCCB7]/50 hover:text-[#EDE7DB] hover:scale-105 active:scale-95 transition-all duration-300 ${
            isTransitioning ? "opacity-20 cursor-not-allowed pointer-events-none" : "cursor-pointer"
          }`}
          aria-label="Next Work"
          disabled={isTransitioning}
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={1.5} />
        </button>
        
      </div>
    </section>
  );
}
