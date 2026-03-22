"use client";

import HeaderSection from "@/src/components/Header/Header";
import ProfileHeaderSection from "./sections/ProfileHeaderSection";
import ProfileStatsSection from "./sections/ProfileStatsSection";
import { StatisticsSection } from "./sections/StatisticsSection";
import Footer from "@/src/components/Footer/Footer";
import { ProtectedRoute } from "@/src/utils/ProtectedRoute";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  return (
    <ProtectedRoute>
      <HeaderSection />
      <main className="flex-1 px-5">
        <div className="max-w-xl md:max-w-5xl bg-primary border border-border rounded-[20px] mx-auto">
            <ProfileHeaderSection username={username} />
            <ProfileStatsSection />
            <StatisticsSection />
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
