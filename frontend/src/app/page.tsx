import { Navbar } from "~/app/brutalist/_components/landing/Navbar";
import { Hero } from "~/app/brutalist/_components/landing/Hero";
import { Features } from "~/app/brutalist/_components/landing/Features";
import { HowItWorks } from "~/app/brutalist/_components/landing/HowItWorks";
import { CTA } from "~/app/brutalist/_components/landing/CTA";
import { Footer } from "~/app/brutalist/_components/landing/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
