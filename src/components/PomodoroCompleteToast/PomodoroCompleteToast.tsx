"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePomodoro } from "@/src/context/PomodoroContext";
import { Button } from "@/src/components/Button/Button";
import { RayIcon } from "@/src/components/Icon/Icon";
import { ClockIcon } from "lucide-react";
import { playNotificationSound } from "@/src/utils/audioNotification";


export default function PomodoroCompleteToast() {
  const router = useRouter();
  const pathname = usePathname();
  const { isFinished, isLoading, status, skillEmoji, clearStatus, syncStatus } = usePomodoro();

  useEffect(() => {
    syncStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isOpen = !isLoading && isFinished && !!status;

  // Play sound once when modal becomes visible
  useEffect(() => {
    if (isOpen) playNotificationSound();
  }, [isOpen]);

  if (!isOpen || !status) return null;

  const handleStartNew = () => {
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
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-16">{skillEmoji}</span>
              <span className="text-off-white text-16 md:text-20 font-bold">
                {status.skillName}
              </span>
            </div>
            <div className="bg-button-primary text-background px-3 py-1.5 rounded-[8px] text-14 md:text-16 font-bold whitespace-nowrap flex items-center gap-1">
              <RayIcon className="w-4 h-4" /> {xpEarned} XP
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
