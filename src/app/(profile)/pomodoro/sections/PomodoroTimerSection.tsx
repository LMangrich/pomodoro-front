"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ChooseSkillModal from "../components/Modal/ChooseSkillModal";
import PomodoroCompleteModal from "../components/Modal/PomodoroCompleteModal";
import { usePomodoro } from "@/src/hooks/usePomodoro";
import { useUser } from "@/src/context/UserContext";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import type { Skill } from "@/src/types/skill.types";
import type { UserSkill } from "@/src/types/user.types";
import { Button } from "@/src/components/Button/Button";
import { cn } from "@/src/lib/utils";
import { CogIcon, PlusIcon, RayIcon } from "@/src/components/Icon/Icon";
import { playNotificationSound } from "@/src/utils/audioNotification";

export default function PomodoroTimerSection() {
  const router = useRouter();
  const { userData } = useUser();
  const { skills, refetch: refetchSkills } = useUserProfile(userData?.username);
  const { startPomodoro, abandonPomodoro, calculateExpectedXp, constants } = usePomodoro();

  const pomodoroMinutes = constants?.defaultDuration ?? 25;

  const [minutes, setMinutes] = useState(pomodoroMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [expectedXp, setExpectedXp] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completedDuration, setCompletedDuration] = useState(0);
  const [completedSkillData, setCompletedSkillData] = useState<UserSkill | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Pomodoro complete
            playNotificationSound();
            setIsRunning(false);
            if (selectedSkill) {
              setCompletedDuration(pomodoroMinutes);
              // Find the updated skill data after completion
              const skillData = skills.find(s => s.id === selectedSkill.id);
              setCompletedSkillData(skillData || null);
              setIsCompleteModalOpen(true);
              // Refetch skills to get updated data
              refetchSkills();
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
  }, [isRunning, minutes, seconds, selectedSkill, pomodoroMinutes, skills, refetchSkills]);


  const handleStartStop = async () => {
    if (!isRunning && selectedSkill) {
      try {
        console.log('[PomodoroTimerSection] Starting timer with skill:', selectedSkill.id, 'Duration:', pomodoroMinutes);
        await startPomodoro(selectedSkill.id, pomodoroMinutes);
        console.log('[PomodoroTimerSection] Timer started successfully');
        setIsRunning(true);
      } catch (err) {
        console.error("Failed to start pomodoro:", err);
        alert(`Erro ao iniciar pomodoro: ${err instanceof Error ? err.message : 'Desconhecido'}`);
        return;
      }
    } else if (isRunning) {
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
    const xp = await calculateExpectedXp(skill.id, pomodoroMinutes);
    setExpectedXp(xp);
  }, [calculateExpectedXp, pomodoroMinutes]);


  const handleStartNewPomodoro = () => {
    setIsCompleteModalOpen(false);
    setMinutes(pomodoroMinutes);
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
        onStartNew={handleStartNewPomodoro}
        onGoToProfile={handleGoToProfile}
        skillName={selectedSkill?.name || ""}
        xpEarned={expectedXp}
        skillData={completedSkillData}
        completionTime={completedDuration}
      />
    <section className="flex flex-col items-center gap-12">
      <div className="w-full max-w-[623px] bg-primary border border-border rounded-[20px] p-8 flex flex-col items-center gap-10">
          <div className="flex flex-row w-full justify-center gap-5 ">
          <Button variant="primary" className={cn("px-6 py-2 text-14 hover:opacity-100 border-none transition-colors")}>
              Pomodoro
          </Button>

          <Button variant="primary" className="max-w-[40px] w-full p-0 flex items-center justify-center">
            <CogIcon className="text-background"/>
          </Button>
        </div>

        <div className="text-off-white text-[96px] font-bold leading-none tracking-tight">
          {formatTime(minutes, seconds)}
        </div>

        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-button-primary transition-all duration-1000"
            style={{ 
              width: `${((pomodoroMinutes * 60 - (minutes * 60 + seconds)) / (pomodoroMinutes * 60)) * 100}%` 
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
          {isRunning ? "ABANDONAR" : "COMEÇAR"}
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
          <div className="border-2 border-line rounded-[20px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-20">{selectedSkill.emojString ?? "📚"}</span>
              <span className="text-off-white text-20 font-bold">
                {selectedSkill.name}
              </span>
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
