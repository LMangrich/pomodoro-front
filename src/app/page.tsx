import HeroSection from "./home/sections/HeroSection";
import FAQSection from "./home/sections/FAQSection";
import HeaderSection from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { cn } from "../lib/utils";

export default function HomePage() {
  return (
    <>
      <HeaderSection />
      <main className={cn("max-w-xl md:max-w-5xl mx-auto px-5 lg:px-0")}>
        <HeroSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
