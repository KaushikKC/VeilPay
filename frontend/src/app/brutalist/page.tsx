import { Navbar } from "~/app/brutalist/_components/landing/Navbar";
import { Hero } from "~/app/brutalist/_components/landing/Hero";
import { GlobeSection } from "~/app/brutalist/_components/landing/GlobeSection";
import { Features } from "~/app/brutalist/_components/landing/Features";
import { HowItWorks } from "~/app/brutalist/_components/landing/HowItWorks";
import { CTA } from "~/app/brutalist/_components/landing/CTA";
import { Footer } from "~/app/brutalist/_components/landing/Footer";

export default function BrutalistHome() {
  return (
    <main>
      <Navbar />
      <Hero />
      <GlobeSection />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
