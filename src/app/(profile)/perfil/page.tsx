"use client";

import HeaderSection from "@/src/components/Header/Header";
import ProfileHeaderSection from "./sections/ProfileHeaderSection";
import ProfileStatsSection from "./sections/ProfileStatsSection";
import { StatisticsSection } from "./sections/StatisticsSection";
import Footer from "@/src/components/Footer/Footer";
import { ProtectedRoute } from "@/src/utils/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <HeaderSection />
      <main>
        <div className="max-w-5xl bg-primary border border-border rounded-[20px] mx-auto">
            <ProfileHeaderSection />
            <ProfileStatsSection />
            <StatisticsSection />
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
