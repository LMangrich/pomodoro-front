"use client";

import { PencilIcon } from "lucide-react";
import { useUser } from "@/src/context/UserContext";
import { useUserProfile } from "@/src/hooks/useUserProfile";

export default function ProfileHeaderSection() {
  const { userData } = useUser();
  const { stats } = useUserProfile(userData?.username);

  const totalXp = stats?.totalXp ?? 0;
  const totalHours = stats ? Math.floor(stats.totalFocusMinutes / 60) : 0;

  return (
    <section className="bg-inner rounded-t-[20px] p-12 w-full mb-8 relative">
      <div className="absolute top-0 right-0 flex gap-2">
        <button className="text-off-white hover:text-button-primary transition-colors">
          <PencilIcon className="w-5 h-5" />
        </button>
        <button className="text-off-white hover:text-button-primary transition-colors text-20">
          ✕
        </button>
      </div>

      <div className="flex flex-row  items-center gap-10">
        <div className="w-[175px] h-[175px] bg-background rounded-full flex items-center justify-center border-4 border-background">
          <span className="text-48 text-off-white">👤</span>
        </div>

        <div className="text-left">
            <div className="leading-tight">
                <h1 className="text-off-white text-32 font-bold">
                    {userData?.name || "Carregando..."}
                </h1>
                <p className="text-off-white text-16 mb-4">
                    @{userData?.username || ""}
                </p>
            </div>

          <div className="flex gap-3 justify-center">
            <div className="bg-button-primary text-background rounded-[8px] px-3 py-1">
              <span className="text-14 font-bold">
                ⚡ {totalXp} XP TOTAL
              </span>
            </div>
            <div className="bg-button-primary text-background rounded-[8px] px-3 py-1">
              <span className="text-14 font-bold">
                🔥 {totalHours} HORAS DE FOCO
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
