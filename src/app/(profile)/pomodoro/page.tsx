"use client";

import HeaderSection from "@/src/components/Header/Header";
import PomodoroTimerSection from "./sections/PomodoroTimerSection";
import Footer from "@/src/components/Footer/Footer";
import { ProtectedRoute } from "@/src/utils/ProtectedRoute";

export default function TimerPage() {
  return (
    <ProtectedRoute>
      <HeaderSection />
      <main className="max-w-5xl mx-auto px-5 lg:px-0">
        <PomodoroTimerSection />
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
