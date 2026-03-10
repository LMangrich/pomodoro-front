"use client";

import HeaderSection from "@/src/components/Header/Header";
import LoginFormSection from "./sections/LoginFormSection";
import Footer from "@/src/components/Footer/Footer";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
import { useEffect } from "react";
import { LoadingSplash } from "@/src/components/LoadingSplash/LoadingSplash";

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useUser();
  
    useEffect(() => {
      if (!isLoading && isAuthenticated) {
        router.push("/pomodoro");
      }
    }, [isAuthenticated, isLoading, router]);
  
    if (isLoading) {
      return <LoadingSplash />;
    }
  
    if (isAuthenticated) {
      return null;
    }
  
  return (
    <>
      <HeaderSection />
      <main className="max-w-xl md:max-w-5xl mx-auto px-5 lg:px-0">
        <LoginFormSection />
      </main>
      <Footer />
    </>
  );
}
