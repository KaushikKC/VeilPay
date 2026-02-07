import { Navbar } from "~/app/_components/landing/Navbar";
import { Hero } from "~/app/_components/landing/Hero";
import { Features } from "~/app/_components/landing/Features";
import { HowItWorks } from "~/app/_components/landing/HowItWorks";
import { CTA } from "~/app/_components/landing/CTA";
import { Footer } from "~/app/_components/landing/Footer";

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
