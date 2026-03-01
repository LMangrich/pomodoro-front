"use client";

import { Button } from "@/src/components/Button/Button";
import { ClockIcon } from "lucide-react";

interface PomodoroCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNew: () => void;
  onGoToProfile: () => void;
  skillName: string;
  xpEarned: number;
  totalXp: number;
  completionTime: number;
}

export default function PomodoroCompleteModal({
  isOpen,
  onClose,
  onStartNew,
  onGoToProfile,
  skillName,
  xpEarned,
  totalXp,
  completionTime,
}: PomodoroCompleteModalProps) {
  if (!isOpen) return null;

  const progressPercentage = (totalXp / 1234) * 100; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="max-w-lg relative w-full bg-primary border border-border rounded-[20px] p-9 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
            <span className="text-40 text-button-primary">✓</span>
            <h2 className="text-off-white text-28 font-bold text-center">
                Pomodoro concluído!
            </h2>
        </div>

        <div className="w-full border-2 border-button-primary rounded-[20px] px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-16">📚</span>
              <span className="text-off-white text-20 font-bold">
                {skillName}
              </span>
            </div>
            <div className="bg-button-primary text-background px-3 py-1.5 rounded-[8px] text-16 font-bold">
              ⚡ {xpEarned} XP
            </div>
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-off-white text-14 font-bold">
              {totalXp}/{1234} XP
            </span>
            <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-button-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-off-white text-14 font-bold">
              NV. 6
            </span>
          </div>
        </div>

        <div className="w-full border-2 border-button-primary rounded-[20px] p-4 flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <ClockIcon className="w-6 h-6 text-button-primary" />
            <span className="text-off-white text-20 font-bold">
              Tempo de conclusão
            </span>
          </div>
          <div className="bg-button-primary text-background px-3 py-1.5 rounded-[8px] text-16 font-bold">
            {completionTime} min
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={onStartNew}
            className="w-full h-[46px]"
          >
            INICIAR NOVO POMODORO
          </Button>
          <Button
            variant="secondary"
            onClick={onGoToProfile}
            className="w-full h-[46px] bg-transparent border-2 border-off-white text-off-white hover:bg-off-white/10"
          >
            IR PARA O PERFIL
          </Button>
        </div>
      </div>
    </div>
  );
}
