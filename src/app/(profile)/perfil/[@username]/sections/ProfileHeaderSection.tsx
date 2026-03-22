"use client";

import { Clock, PencilIcon } from "lucide-react";
import { useUser } from "@/src/context/UserContext";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { RayIcon } from "@/src/components/Icon/Icon";

interface ProfileHeaderSectionProps {
  username?: string;
}

export default function ProfileHeaderSection({ username }: ProfileHeaderSectionProps) {
  const { userData } = useUser();
  const profileUsername = username || userData?.username;
  const { stats } = useUserProfile(profileUsername);

  const totalXp = stats?.totalXp ?? 0;
  const totalHours = stats?.totalFocusedTimeHours ?? 0;

  return (
    <section className="bg-inner rounded-t-[20px] p-6 md:p-12 w-full mb-8 relative">
      <div className="absolute top-4 md:top-10 right-4 md:right-10 flex gap-2">
        <button className="text-off-white hover:text-button-primary transition-colors">
          <PencilIcon className="w-4 md:w-5 h-4 md:h-5" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
        <div className="w-24 md:w-[175px] h-24 md:h-[175px] bg-primary rounded-full flex-shrink-0 flex items-center justify-center ">
          <span className="text-36 md:text-48 text-off-white">👤</span>
        </div>

        <div className="text-center md:text-left flex-1">
            <div className="leading-tight mb-4">
              <h1 className="text-off-white text-24 md:text-32 font-bold">
                  {userData?.name || "Carregando..."}
              </h1>
              <p className="text-off-white text-14 md:text-16 mb-3 md:mb-4">
                  @{profileUsername || ""}
              </p>
            </div>

          <div className="flex flex-col md:flex-row gap-2 md:gap-3 justify-center md:justify-start">
            <div className="bg-button-primary text-background rounded-[8px] px-3 py-1">
              <span className="text-12 md:text-14 font-bold flex flex-row items-center justify-center md:justify-start gap-1.5">
                <RayIcon className="w-4 h-4" /> {totalXp} XP TOTAL
              </span>
            </div>
            <div className="bg-button-primary text-background rounded-[8px] px-3 py-1">
              <span className="text-12 md:text-14 font-bold flex flex-row items-center justify-center md:justify-start gap-1.5">
                <Clock className="w-3 md:w-4 h-3 md:h-4" strokeWidth={3}/> {totalHours.toFixed(1)} HORAS DE FOCO
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
