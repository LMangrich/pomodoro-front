"use client";

import { Button } from "@/src/components/Button/Button";
import { RayIcon } from "@/src/components/Icon/Icon";
import { ClockIcon } from "lucide-react";
import type { UserSkill } from "@/src/types/user.types";

interface PomodoroCompleteModalProps {
  isOpen: boolean;
  onStartNew: () => void;
  onGoToProfile: () => void;
  skillName: string;
  xpEarned: number;
  skillData: UserSkill | null;
  completionTime: number;
}

export default function PomodoroCompleteModal({
  isOpen,
  onStartNew,
  onGoToProfile,
  skillName,
  xpEarned,
  skillData,
  completionTime,
}: PomodoroCompleteModalProps) {
  if (!isOpen) return null;

  const progressPercentage = skillData ? ((skillData.xpForNextLevel - skillData.xpNeededForNextLevel) / skillData.xpForNextLevel) * 100 : 0; 

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
              <span className="text-16">📚</span>
              <span className="text-off-white text-16 md:text-20 font-bold">
                {skillName}
              </span>
            </div>
            <div className="bg-button-primary text-background px-3 py-1.5 rounded-[8px] text-14 md:text-16 font-bold whitespace-nowrap flex items-center gap-1">
              <RayIcon className="w-4 h-4" /> {xpEarned} XP
            </div>
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-off-white text-14 font-bold">
              {skillData ? `${skillData.totalXp}/${skillData.xpForNextLevel}` : "0/0"} XP
            </span>
            <div className="flex-1 h-2 bg-border rounded-full overflow-hidden w-full md:w-auto">
              <div
                className="h-full bg-button-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              />
            </div>
            <span className="text-off-white text-12 md:text-14 font-bold whitespace-nowrap">
              NV. {skillData?.currentLevel || 1}
            </span>
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
            {completionTime} min
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={onStartNew}
            className="w-full h-11 md:h-[46px] text-14 md:text-16"
          >
            INICIAR NOVO POMODORO
          </Button>
          <Button
            variant="secondary"
            onClick={onGoToProfile}
            className="w-full h-11 md:h-[46px] bg-transparent border-2 border-off-white text-off-white hover:bg-off-white/10 text-14 md:text-16"
          >
            IR PARA O PERFIL
          </Button>
        </div>
      </div>
    </div>
  );
}
