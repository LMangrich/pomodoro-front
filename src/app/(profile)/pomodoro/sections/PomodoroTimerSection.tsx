"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ChooseSkillModal from "../components/Modal/ChooseSkillModal";
import PomodoroCompleteModal from "../components/Modal/PomodoroCompleteModal";
import { usePomodoro } from "@/src/hooks/usePomodoro";
import type { Skill } from "@/src/types/skill.types";
import { Button } from "@/src/components/Button/Button";
import { cn } from "@/src/lib/utils";
import { CogIcon, PlusIcon } from "@/src/components/Icon/Icon";

type TimerMode = "pomodoro" | "short-break" | "long-break";

export default function PomodoroTimerSection() {
  const router = useRouter();
  const { startPomodoro, abandonPomodoro, calculateExpectedXp, constants } = usePomodoro();

  const timerModes = {
    pomodoro: constants?.defaultDuration ?? 25,
    "short-break": 5,
    "long-break": 15,
  };

  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [minutes, setMinutes] = useState(timerModes.pomodoro);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [expectedXp, setExpectedXp] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completedDuration, setCompletedDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false);
            if (mode === "pomodoro" && selectedSkill) {
              setCompletedDuration(timerModes[mode]);
              setIsCompleteModalOpen(true);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, minutes, seconds, mode, selectedSkill]);

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setMinutes(timerModes[newMode]);
    setSeconds(0);
    setIsRunning(false);
  };

  const handleStartStop = async () => {
    if (!isRunning && mode === "pomodoro" && selectedSkill) {
      try {
        console.log('[PomodoroTimerSection] Starting timer with skill:', selectedSkill.id, 'Duration:', timerModes.pomodoro);
        await startPomodoro(selectedSkill.id, timerModes.pomodoro);
        console.log('[PomodoroTimerSection] Timer started successfully');
        setIsRunning(true);
      } catch (err) {
        console.error("Failed to start pomodoro:", err);
        alert(`Erro ao iniciar pomodoro: ${err instanceof Error ? err.message : 'Desconhecido'}`);
        return;
      }
    } else if (isRunning && mode === "pomodoro") {
      try {
        await abandonPomodoro();
        setIsRunning(false);
      } catch (err) {
        console.error("Failed to abandon pomodoro:", err);
      }
    }
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChooseSkill = useCallback(async (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(false);
    const xp = await calculateExpectedXp(skill.id, timerModes.pomodoro);
    setExpectedXp(xp);
  }, [calculateExpectedXp, timerModes.pomodoro]);

  const handleComplete = () => {
    setIsCompleteModalOpen(true);
  };

  const handleStartNewPomodoro = () => {
    setIsCompleteModalOpen(false);
    setMinutes(timerModes[mode]);
    setSeconds(0);
    setIsRunning(false);
  };

  const handleGoToProfile = () => {
    router.push("/perfil");
  };

  return (
    <>
      <ChooseSkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChooseSkill={handleChooseSkill}
      />
      <PomodoroCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onStartNew={handleStartNewPomodoro}
        onGoToProfile={handleGoToProfile}
        skillName={selectedSkill?.name || ""}
        xpEarned={expectedXp}
        totalXp={expectedXp}
        completionTime={completedDuration}
      />
    <section className="flex flex-col items-center gap-12">
      <div className="w-full max-w-[623px] bg-primary border border-border rounded-[20px] p-8 flex flex-col items-center gap-10">
        <div className="flex gap-3 w-full justify-center flex-wrap">
          <Button
            onClick={() => handleModeChange("pomodoro")}
            variant="primary"
            className={cn(
              "px-6 py-2 text-14 border-none transition-colors",
              mode === "pomodoro"
                ? ""
                : "bg-button-primary/70 hover:text-off-white"
            )}
          >
            Pomodoro
          </Button>
          <Button
            onClick={() => handleModeChange("short-break")}
            variant="primary"
            className={cn(
              "px-6 py-2 text-14 border-none transition-colors",
              mode === "short-break"
                ? ""
                : "bg-button-primary/70 hover:text-off-white"
            )}
          >
            Pausa curta
          </Button>
          <Button
            onClick={() => handleModeChange("long-break")}
            variant="primary"
            className={cn(
              "px-6 py-2 text-14 border-none transition-colors",
              mode === "long-break"
                ? ""
                : "bg-button-primary/70 hover:text-off-white"
            )}
          >
            Pausa longa
          </Button>
          <Button
            variant="primary"
            className="max-w-[40px] w-full p-0 flex items-center justify-center"
          >
            <CogIcon className="text-background"/>
          </Button>
        </div>

        {/* Timer Display */}
        <div className="text-off-white text-[96px] font-bold leading-none tracking-tight">
          {formatTime(minutes, seconds)}
        </div>

        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-button-primary transition-all duration-1000"
            style={{ 
              width: `${((timerModes[mode] * 60 - (minutes * 60 + seconds)) / (timerModes[mode] * 60)) * 100}%` 
            }}
          />
        </div>

        <Button
          variant="primary"
          onClick={handleStartStop}
          disabled={!selectedSkill}
          className={cn(
            "w-full",
            !selectedSkill && "opacity-50 cursor-not-allowed"
          )}
        >
          {isRunning ? "PAUSAR" : "COMEÇAR"}
        </Button>
      </div>

      <div className="w-full max-w-[623px] flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h3 className="text-off-white text-20 font-bold">
            Habilidade ativa
          </h3>
          {selectedSkill && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-button-primary text-16 font-bold underline"
            >
              Trocar habilidade
            </button>
          )}
        </div>
        
        {selectedSkill ? (
          <>
            <div className="border-2 border-line rounded-[20px] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-20">{selectedSkill.emojString ?? "📚"}</span>
                <span className="text-off-white text-20 font-bold">
                  {selectedSkill.name}
                </span>
              </div>
              <div className="bg-button-primary text-background px-3 py-1.5 rounded-[8px] text-16 font-bold flex items-center gap-2">
                ⚡ {expectedXp} XP
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleComplete}
              disabled={!isRunning}
              className={cn(
                "w-full h-[46px]",
                !isRunning && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-16">x</span>
                ABANDONAR
              </div>
            </Button>
          </>
        ) : (
          <Button
            variant="secondary"
            className="rounded-[20px] p-7 text-16"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex flex-row items-center justify-center gap-4">
              <PlusIcon className="text-button-primary"/>
              Escolher habilidade
            </div>
          </Button>
        )}
      </div>
    </section>
    </>
  );
}    
