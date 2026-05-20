"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectShowcase, { type ProjectData } from "./ProjectShowcase";

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

// ─── Rich project data for the showcase overlay ───
const PROJECT_DATA: Record<number, ProjectData> = {
  1: {
    id: 1,
    title: "Serene Living",
    category: "Interior Design",
    color: "#4D342D",
    textColor: "#E5E0D8",
    heroImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=90",
    concept: {
      headline: "Where Stillness Meets Warmth",
      description:
        "Inspired by the Japanese philosophy of Ma—negative space as a deliberate design element—this living room distills comfort to its essence. Every surface, every shadow, every gap between objects is intentional, creating a room that breathes."
    },
    details: {
      location: "Makati City, PH",
      area: "85 sqm",
      year: "2024",
      style: "Japandi"
    },
    floorplan:
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=85",
    perspectives: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=90",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&q=85"
    ],
    sections: [
      {
        title: "Living Area",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=85",
        description:
          "The primary gathering space marries low-profile linen seating with warm oak flooring. A curated selection of ceramics and dried botanicals anchor the palette to nature without overwhelming the senses."
      },
      {
        title: "Reading Nook",
        image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1000&q=85",
        description:
          "Tucked beneath a sweep of sheer curtain light, the reading corner features a sculptural lounge chair and a hand-thrown side table—quiet luxury for a slow afternoon."
      }
    ],
    materials: [
      { name: "White Oak", color: "#C4A882" },
      { name: "Oatmeal Linen", color: "#E5DDD0" },
      { name: "Charcoal Plaster", color: "#4A4A46" },
      { name: "Warm White", color: "#F5F0E8" },
      { name: "Matte Brass", color: "#B5975A" }
    ]
  },
  2: {
    id: 2,
    title: "Carrara Kitchen",
    category: "Interior Design",
    color: "#E5E0D8",
    textColor: "#4D342D",
    heroImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=90",
    concept: {
      headline: "Stone, Light & the Art of Preparation",
      description:
        "A culinary stage carved from Carrara marble and softened by warm pendant lighting. The kitchen becomes a gallery—where every meal is a performance and every surface invites the hand."
    },
    details: {
      location: "BGC, Taguig, PH",
      area: "42 sqm",
      year: "2024",
      style: "Modern Classic"
    },
    floorplan:
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=85",
    perspectives: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=90",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85",
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=900&q=85"
    ],
    sections: [
      {
        title: "Island Counter",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&q=85",
        description:
          "The centrepiece—a cantilevered Carrara island—floats above the timber floor on a concealed steel frame, lending an air of effortless weightlessness to the heavy stone."
      },
      {
        title: "Pantry Wall",
        image: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1000&q=85",
        description:
          "Floor-to-ceiling fluted-oak cabinetry conceals a full walk-in pantry, maintaining the kitchen's clean silhouette while housing an abundance of storage."
      }
    ],
    materials: [
      { name: "Carrara Marble", color: "#E8E3DC" },
      { name: "Brushed Brass", color: "#C9A84C" },
      { name: "Smoked Oak", color: "#6E5B47" },
      { name: "Soft Black", color: "#2C2C2C" },
      { name: "Ivory Ceramic", color: "#F2EDE4" }
    ]
  },
  3: {
    id: 3,
    title: "Golden Hour Suite",
    category: "Interior Design",
    color: "#8C9485",
    textColor: "#1A1410",
    heroImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=90",
    concept: {
      headline: "Chasing Light Through Every Room",
      description:
        "Designed to capture the shifting quality of Philippine golden-hour light, the suite orients every surface to amplify warmth—terracotta floors absorb and re-radiate sunlight, while sheer drapery diffuses it into a honeyed glow."
    },
    details: {
      location: "Alabang, Muntinlupa",
      area: "120 sqm",
      year: "2023",
      style: "Mediterranean Modern"
    },
    floorplan:
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=85",
    perspectives: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=90",
      "https://images.unsplash.com/photo-1600566753086-00cec6987f49?w=900&q=85",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=85"
    ],
    sections: [
      {
        title: "Master Bedroom",
        image: "https://images.unsplash.com/photo-1600566753086-00cec6987f49?w=1000&q=85",
        description:
          "An arched doorway frames the bed, creating a deliberate threshold between waking and sleeping. The earthy palette is anchored by a hand-plastered accent wall in warm clay."
      },
      {
        title: "Ensuite Terrace",
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&q=85",
        description:
          "Sliding bi-fold doors dissolve the boundary between interior and a private terrace, extending the living area into the open air and framing the evening sky."
      }
    ],
    materials: [
      { name: "Terracotta", color: "#C27F53" },
      { name: "Raw Plaster", color: "#D9CEBD" },
      { name: "Sage Green", color: "#8C9485" },
      { name: "Warm Sand", color: "#E0D3BF" },
      { name: "Iron Black", color: "#2F2F2E" }
    ]
  },
  4: {
    id: 4,
    title: "Dusk Facade",
    category: "Exterior Design",
    color: "#4A5254",
    textColor: "#E5E0D8",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=90",
    concept: {
      headline: "Architecture That Inhabits the Twilight",
      description:
        "The facade was conceived to transform at dusk—deep charcoal cladding recedes into the evening sky while interior light spills outward through floor-to-ceiling glazing, inverting the traditional notion of shelter."
    },
    details: {
      location: "Tagaytay, Cavite",
      area: "350 sqm",
      year: "2024",
      style: "Contemporary Tropical"
    },
    floorplan:
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=85",
    perspectives: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=90",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=85"
    ],
    sections: [
      {
        title: "Entry Courtyard",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=85",
        description:
          "A walled courtyard with a reflecting pool creates a decompression zone between the street and the interior, filtering sound, light, and movement through layered plantings of tropical ferns."
      },
      {
        title: "Cantilevered Volume",
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1000&q=85",
        description:
          "The upper floor projects dramatically over the garden, sheltering an outdoor living area below while framing a panoramic view of the Taal volcano ridge from the master suite."
      }
    ],
    materials: [
      { name: "Charcoal Zinc", color: "#4A5254" },
      { name: "Exposed Concrete", color: "#A09E97" },
      { name: "Clear Glass", color: "#D4E4E6" },
      { name: "Mahogany Timber", color: "#6B3A2E" },
      { name: "Volcanic Stone", color: "#3E3E3C" }
    ]
  },
  5: {
    id: 5,
    title: "Stillwater Bath",
    category: "Interior Design",
    color: "#B58C70",
    textColor: "#1A1410",
    heroImage: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&q=90",
    concept: {
      headline: "Ritual Over Routine",
      description:
        "Reimagining the bathroom as a place of ritual rather than function. Inspired by the onsen tradition, every element—from the freestanding stone tub to the rain shower carved into a niche—encourages presence and slowness."
    },
    details: {
      location: "Quezon City, PH",
      area: "28 sqm",
      year: "2023",
      style: "Wabi-Sabi"
    },
    floorplan:
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=85",
    perspectives: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&q=90",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=900&q=85"
    ],
    sections: [
      {
        title: "Soaking Tub",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1000&q=85",
        description:
          "Carved from a single block of limestone, the freestanding tub sits on a raised platform of river-washed pebbles, connecting the bather to raw, elemental textures."
      },
      {
        title: "Vanity Alcove",
        image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1000&q=85",
        description:
          "A floating vanity in brushed walnut is set within a micro-cement alcove, illuminated by a concealed linear LED that traces the contour of the niche."
      }
    ],
    materials: [
      { name: "Limestone", color: "#CFC3B1" },
      { name: "Walnut", color: "#6B5240" },
      { name: "Micro-Cement", color: "#A89D90" },
      { name: "Matte Black", color: "#222221" },
      { name: "Pebble Grey", color: "#B3AFA7" }
    ]
  },
  6: {
    id: 6,
    title: "Retro Revival",
    category: "Interior Design",
    color: "#1A1410",
    textColor: "#E5E0D8",
    heroImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=90",
    concept: {
      headline: "Nostalgia, Recomposed",
      description:
        "A bold dialogue between mid-century silhouettes and contemporary restraint. Rich velvets, curved forms, and brass accents are placed against a dark, moody backdrop—paying homage to the past while speaking the language of now."
    },
    details: {
      location: "Eastwood, QC",
      area: "65 sqm",
      year: "2024",
      style: "Mid-Century Modern"
    },
    floorplan:
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=85",
    perspectives: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=90",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=900&q=85",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85"
    ],
    sections: [
      {
        title: "The Statement Sofa",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=85",
        description:
          "A deep emerald velvet sectional, reupholstered with tufted channel detailing, becomes the gravitational centre of the room—equal parts sculpture and seating."
      },
      {
        title: "Media Wall",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1000&q=85",
        description:
          "Floor-to-ceiling walnut shelving frames a recessed fireplace and media unit, the dark timber dissolving into the charcoal walls to create a seamless, immersive focal plane."
      }
    ],
    materials: [
      { name: "Emerald Velvet", color: "#2E6B52" },
      { name: "Dark Walnut", color: "#3D2B1F" },
      { name: "Polished Brass", color: "#D4A843" },
      { name: "Charcoal", color: "#1A1410" },
      { name: "Cream Bouclé", color: "#E8E0D2" }
    ]
  },
  7: {
    id: 7,
    title: "Minimalist Lounge",
    category: "Interior Design",
    color: "#C2B29F",
    textColor: "#4D342D",
    heroImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=90",
    concept: {
      headline: "Less, But Better",
      description:
        "Guided by Dieter Rams' timeless principle, this lounge strips away ornament to reveal the beauty of proportion, material, and light. What remains is honest, purposeful, and quietly magnetic."
    },
    details: {
      location: "Rockwell, Makati",
      area: "55 sqm",
      year: "2025",
      style: "Minimalist"
    },
    floorplan:
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=85",
    perspectives: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=90",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=900&q=85",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=900&q=85"
    ],
    sections: [
      {
        title: "Open Living",
        image: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=1000&q=85",
        description:
          "An uninterrupted floor plane in honed travertine unifies the entire ground level. Furniture is deliberately sparse—each piece earns its place through both function and form."
      },
      {
        title: "Light Study",
        image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1000&q=85",
        description:
          "A double-height window wall brings the arc of the sun inside, casting moving shadows that become the room's only decoration—architecture as sundial."
      }
    ],
    materials: [
      { name: "Travertine", color: "#D5C9B8" },
      { name: "White Plaster", color: "#F0EBE3" },
      { name: "Pale Oak", color: "#C8B898" },
      { name: "Fog Grey", color: "#B0ADA6" },
      { name: "Satin Steel", color: "#C4C4C2" }
    ]
  }
};

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const swatchesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

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

  const handleSwatchClick = (swatch: typeof SWATCHES[number]) => {
    if (swatch.isCover) return;
    const projectData = PROJECT_DATA[swatch.id as number];
    if (projectData) {
      setSelectedProject(projectData);
    }
  };

  return (
    <>
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
                className={`absolute inset-0 shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-sm flex flex-col will-change-transform border border-black/5 transform-gpu ${
                  !swatch.isCover ? "cursor-pointer" : ""
                }`}
                style={{
                  backgroundColor: swatch.color,
                  color: swatch.textColor,
                  transformOrigin: "calc(100% - 32px) 32px", // Pivot at top right
                  zIndex: SWATCHES.length - i,
                  backfaceVisibility: "hidden"
                }}
                onClick={() => handleSwatchClick(swatch)}
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
                    <div className="flex-1 relative overflow-hidden mb-3 md:mb-4 bg-black/5 rounded-sm shadow-inner group">
                      <img
                        src={swatch.src}
                        alt={swatch.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                      {/* View Project indicator */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="bg-black/50 backdrop-blur-sm text-white font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase px-5 py-2.5 rounded-full">
                          View Project
                        </span>
                      </div>
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

      {/* Project Showcase Overlay */}
      <ProjectShowcase
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
