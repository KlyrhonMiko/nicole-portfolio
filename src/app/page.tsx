import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Works from "@/components/Works";
import Works3D from "@/components/Works3D";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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
