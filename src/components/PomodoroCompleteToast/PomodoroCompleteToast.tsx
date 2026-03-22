"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePomodoro } from "@/src/context/PomodoroContext";
import { useUser } from "@/src/context/UserContext";
import { userService } from "@/src/services/user.service";
import { Button } from "@/src/components/Button/Button";
import { RayIcon } from "@/src/components/Icon/Icon";
import { ClockIcon } from "lucide-react";
import { playNotificationSound } from "@/src/utils/audioNotification";
import type { UserSkill } from "@/src/types/user.types";


export default function PomodoroCompleteToast() {
  const router = useRouter();
  const pathname = usePathname();
  const { isFinished, isLoading, status, skillEmoji, clearStatus, syncStatus, setTimerMode } = usePomodoro();
  const { userData } = useUser();
  const [skillData, setSkillData] = useState<UserSkill | null>(null);

  useEffect(() => {
    syncStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isOpen = !isLoading && isFinished && !!status;

  // Fetch skill data when status becomes available
  useEffect(() => {
    if (isOpen && status && userData) {
      userService
        .getSkills(userData.username)
        .then((skills) => {
          const skill = skills.find(s => s.skillName === status.skillName);
          if (skill) {
            setSkillData(skill);
          }
        })
        .catch(() => {
          setSkillData(null);
        });
    }
  }, [isOpen, status, userData]);

  // Play sound once when modal becomes visible
  useEffect(() => {
    if (isOpen) playNotificationSound();
  }, [isOpen]);

  if (!isOpen || !status) return null;

  const handleStartNew = () => {
    setTimerMode("descanso");
    clearStatus();
    router.push("/pomodoro");
  };

  const handleGoToProfile = () => {
    clearStatus();
    router.push("/perfil");
  };

  const xpEarned = status.xpNotification ? Number(status.xpNotification) : status.expectedXp;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-5">
      <div className="max-w-lg w-full bg-primary border border-border rounded-[20px] p-6 md:p-9 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          <span className="text-32 md:text-40 text-button-primary">✓</span>
          <h2 className="text-20 md:text-28 font-bold text-center text-off-white">
            Pomodoro concluído!
          </h2>
        </div>

        <div className="w-full border-2 border-button-primary rounded-[20px] px-6 py-5">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-row gap-3 md:gap-4 justify-between">
                <div className="flex flex-row items-center gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <span className="text-20 md:text-24">{skillEmoji}</span>
                  </div>
                  <h3 className="text-off-white text-14 md:text-16 font-bold truncate">
                    {status.skillName}
                  </h3>
                </div>
                <div className="bg-button-primary text-background px-3 py-1.5 rounded-[8px] text-12 md:text-14 font-bold whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                  <RayIcon className="w-4 h-4" /> {xpEarned} XP
                </div>
              </div>
              {skillData && (
                <div className="flex flex-row items-center gap-2">
                    <div className="text-off-white flex-shrink-0 text-12 md:text-14 font-bold ">
                      {skillData.totalXp} XP
                    </div>
                  <div className="flex flex-row items-center gap-2 md:gap-4 w-full">
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden min-w-0">
                      <div
                        className="h-full bg-button-primary rounded-full"
                        style={{ width: `${Math.min(100, (skillData.xpNeededForNextLevel > 0 ? ((skillData.xpForNextLevel - skillData.xpNeededForNextLevel) / skillData.xpForNextLevel) * 100 : 100))}%` }}
                      />
                    </div>
                    <span className="text-off-white text-12 md:text-14 font-bold whitespace-nowrap">
                      NV. {skillData.currentLevel}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full border-2 border-button-primary rounded-[20px] p-4 flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <ClockIcon className="w-6 h-6 text-button-primary" />
            <span className="text-off-white text-16 md:text-20 font-bold">
              Tempo de conclusão
            </span>
          </div>
          <div className="bg-button-primary text-background px-3 py-1.5 rounded-[8px] text-14 md:text-16 font-bold whitespace-nowrap">
            {status.totalDurationMinutes} min
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={handleStartNew}
            className="w-full h-11 md:h-[46px] text-14 md:text-16"
          >
            INICIAR NOVO POMODORO
          </Button>
          <Button
            variant="secondary"
            onClick={handleGoToProfile}
            className="w-full h-11 md:h-[46px] bg-transparent border-2 border-off-white text-off-white hover:bg-off-white/10 text-14 md:text-16"
          >
            IR PARA O PERFIL
          </Button>
        </div>
      </div>
    </div>
  );
}
