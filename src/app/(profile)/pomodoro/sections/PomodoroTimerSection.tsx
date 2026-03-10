"use client";

import { useState, useCallback, useEffect } from "react";
import ChooseSkillModal from "../components/Modal/ChooseSkillModal";
import { usePomodoro } from "@/src/context/PomodoroContext";
import { pomodoroService } from "@/src/services/pomodoro.service";
import { skillService } from "@/src/services/skill.service";
import type { Skill } from "@/src/types/skill.types";
import { Button } from "@/src/components/Button/Button";
import { cn } from "@/src/lib/utils";
import { CogIcon, PlusIcon, RayIcon } from "@/src/components/Icon/Icon";

export default function PomodoroTimerSection() {
  const {
    status,
    secondsRemaining,
    isRunning,
    skillEmoji,
    constants,
    notifyStarted,
    abandon,
  } = usePomodoro();

  const defaultDuration = constants?.defaultDuration ?? 25;
  const totalSeconds = (status?.totalDurationMinutes ?? defaultDuration) * 60;

  const displayMinutes = isRunning ? Math.floor(secondsRemaining / 60) : defaultDuration;
  const displaySeconds = isRunning ? secondsRemaining % 60 : 0;

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewXp, setPreviewXp] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedSkill || isRunning) return;
    let cancelled = false;
    skillService.calculateXp(selectedSkill.id, defaultDuration)
      .then((res) => { if (!cancelled) setPreviewXp(res.expectedXp); })
      .catch(() => { if (!cancelled) setPreviewXp(null); });
    return () => { cancelled = true; };
  }, [selectedSkill, defaultDuration, isRunning]);

  const formatTime = (mins: number, secs: number) =>
    `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  const handleStart = async () => {
    if (!selectedSkill) return;
    try {
      await pomodoroService.start({
        skillId: selectedSkill.id,
        durationTime: defaultDuration,
      });
      notifyStarted((selectedSkill as (typeof selectedSkill & { emojString?: string })).emojString);
    } catch (err) {
      alert(`Erro ao iniciar pomodoro: ${err instanceof Error ? err.message : "Desconhecido"}`);
    }
  };

  const handleAbandon = async () => {
    try {
      await abandon();
      setSelectedSkill(null);
      
    } catch (err) {
      console.error("Failed to abandon pomodoro:", err);
    }
  };

  const handleChooseSkill = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(false);
  }, []);

  const progressPercent =
    totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;

  const expectedXp = isRunning ? (status?.expectedXp ?? 0) : (previewXp ?? 0);
  const activeSkillName = status?.skillName ?? selectedSkill?.name ?? "";

  return (
    <>
      <ChooseSkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChooseSkill={handleChooseSkill}
      />
      <section className="flex flex-col items-center gap-12">
        <div className="w-full max-w-[623px] bg-primary border border-border rounded-[20px] p-8 flex flex-col items-center gap-10">
          <div className="flex flex-row w-full justify-center gap-5">
            <Button
              variant="primary"
              className={cn("px-6 py-2 text-14 hover:opacity-100 border-none transition-colors")}
            >
              Pomodoro
            </Button>
            <Button
              variant="primary"
              className="max-w-[40px] w-full p-0 flex items-center justify-center"
            >
              <CogIcon className="text-background" />
            </Button>
          </div>

          <div className="text-off-white text-[96px] font-bold leading-none tracking-tight w-full text-center">
            {formatTime(displayMinutes, displaySeconds)}
          </div>

          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-button-primary transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {isRunning ? (
            <Button
              variant="primary"
              onClick={handleAbandon}
              className="w-full"
            >
              ABANDONAR
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleStart}
              disabled={!selectedSkill}
              className={cn("w-full", !selectedSkill && "opacity-50 cursor-not-allowed")}
            >
              COMEÇAR
            </Button>
          )}
        </div>

        <div className="w-full max-w-[623px] flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="text-off-white text-20 font-bold">Habilidade ativa</h3>
            {selectedSkill && !isRunning && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-button-primary text-16 font-bold underline"
              >
                Trocar habilidade
              </button>
            )}
          </div>

          {selectedSkill || isRunning ? (
            <div className="border-2 border-line rounded-[20px] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-20">
                  {isRunning
                    ? skillEmoji
                    : (selectedSkill as (Skill & { emojString?: string }) | null)?.emojString ?? "📚"}
                </span>
                <span className="text-off-white text-20 font-bold">{activeSkillName}</span>
              </div>
              <div className="bg-button-primary text-background px-3 py-1.5 rounded-[8px] text-16 font-bold flex items-center gap-2">
                <RayIcon className="w-4 h-4" /> {expectedXp} XP
              </div>
            </div>
          ) : (
            <Button
              variant="secondary"
              className="rounded-[20px] p-7 text-16 hover:bg-button-primary/10 hover:text-off-white border-button-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="flex flex-row items-center justify-center gap-4">
                <PlusIcon className="text-button-primary" />
                Escolher habilidade
              </div>
            </Button>
          )}
        </div>
      </section>
    </>
  );
}
