"use client";
import { useEffect } from "react";
import HeroSection from "./home/sections/HeroSection";
import FAQSection from "./home/sections/FAQSection";
import HeaderSection from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { cn } from "../lib/utils";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/pomodoro");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

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
