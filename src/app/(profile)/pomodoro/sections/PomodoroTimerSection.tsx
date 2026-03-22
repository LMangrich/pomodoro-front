"use client";

import { useRef } from "react";
import ChooseSkillModal from "../components/Modal/ChooseSkillModal";
import { usePomodoro } from "@/src/context/PomodoroContext";
import type { Skill } from "@/src/types/skill.types";
import { Button } from "@/src/components/Button/Button";
import { cn } from "@/src/lib/utils";
import { CogIcon, PlusIcon, RayIcon } from "@/src/components/Icon/Icon";
import { usePomodoroTimer } from "../../../../hooks/usePomodoroTimer";
import { formatTime, updateDurationDraftPart } from "../utils/pomodoroTimerUtils";

export default function PomodoroTimerSection() {
  const {
    status,
    secondsRemaining,
    isRunning,
    skillEmoji,
    constants,
    notifyStarted,
    abandon,
    clearStatus,
    timerMode,
    setTimerMode,
    startDescansoTimer,
    isDescansoActive,
    isPomodoroActive,
  } = usePomodoro();

  const minDuration = constants?.minDuration ?? 5;
  const maxDuration = constants?.maxDuration ?? 120;
  const defaultDuration = constants?.defaultDuration ?? 25;

  const {
    durationSeconds,
    minDurationSeconds,
    maxDurationSeconds,
    selectedSkill,
    isModalOpen,
    durationDraft,
    setDurationDraft,
    setIsModalOpen,
    handleIncreaseDuration,
    handleDecreaseDuration,
    handleStart,
    handleAbandon,
    handleChooseSkill,
    commitDurationInput,
    progressPercent,
    expectedXp,
    activeSkillName,
    minutesPart,
    secondsPart,
    isStarting,
  } = usePomodoroTimer({
    minDuration,
    maxDuration,
    defaultDuration,
    isRunning,
    timerMode,
    status,
    secondsRemaining,
    notifyStarted,
    abandon,
    startDescansoTimer,
  });

  const minutesInputRef = useRef<HTMLInputElement | null>(null);

  const displayMinutes = isRunning ? Math.floor(secondsRemaining / 60) : Math.floor(durationSeconds / 60);
  const displaySeconds = isRunning ? secondsRemaining % 60 : durationSeconds % 60;

  const focusMinutesInput = () => {
    if (isRunning) return;
    const input = minutesInputRef.current;
    if (!input) return;

    input.focus();
    const cursorPosition = input.value.length;
    input.setSelectionRange(cursorPosition, cursorPosition);
  };

  const handleDescansoAbandon = () => {
    clearStatus();
    setTimerMode("pomodoro");
  };

  return (
    <>
      <ChooseSkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChooseSkill={handleChooseSkill}
        durationMinutes={durationSeconds / 60}
      />
      <section className="flex flex-col items-center gap-12 w-full">
        <div className="w-full max-w-md sm:max-w-[623px] bg-primary border border-border rounded-[20px] px-8 py-7 flex flex-col items-center gap-8 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          <div className="flex flex-row w-full items-start sm:items-center justify-center gap-4">
            <Button
              variant="primary"
              onClick={() => !isDescansoActive() && setTimerMode("pomodoro")}
              disabled={isDescansoActive()}
              className={cn("text-14", timerMode === "descanso" && "bg-light-purple")}
            >
              Pomodoro
            </Button>
            <Button
              variant="primary"
              onClick={() => setTimerMode("descanso")}
              disabled={isPomodoroActive()}
              className={cn("text-14",  timerMode === "pomodoro" && "bg-light-purple")}
            >
              Descanso
            </Button>
            
            <Button
              variant="primary"
              className="max-w-[40px] w-full p-2 flex items-center justify-center"
            >
              <CogIcon className="text-background" />
            </Button>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className={cn("border border-dashed border-button-primary/70 rounded-[12px] w-full rounded-[12px] px-10 py-3 min-w-[290px] text-center",
              isRunning ? "border-transparent" : ""
            )}
              onClick={focusMinutesInput}
            >
              {isRunning ? (
                <div className={cn("py-4 text-off-white text-center -translate-x-9 sm:translate-x-9 text-[96px] font-bold leading-none tracking-wide select-none")}>
                  {formatTime(displayMinutes, displaySeconds)}
                </div>
              ) : (
                <div className="-translate-x-9 sm:translate-x-0 w-full flex items-center justify-center gap-3 text-off-white text-[96px] font-bold leading-none tracking-tight">
                  <input
                    ref={minutesInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    value={minutesPart}
                    onChange={(event) => {
                      setDurationDraft(updateDurationDraftPart(event.target.value, durationDraft, durationSeconds));
                    }}
                    onBlur={commitDurationInput}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.currentTarget.blur();
                      }
                    }}
                    className="w-[180px] bg-transparent text-right text-off-white text-[96px] font-bold leading-none tracking-tight outline-none"
                    aria-label="Minutos do pomodoro"
                  />
                  <span aria-hidden="true">:</span>
                  <span className="w-[120px] bg-transparent text-left text-off-white text-[96px] font-bold leading-none tracking-tight">
                    {secondsPart}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-row sm:flex-col gap-2">
              <Button
                variant="primary"
                onClick={handleIncreaseDuration}
                disabled={isRunning || durationSeconds >= maxDurationSeconds}
                aria-label="Aumentar tempo"
              >
                +
              </Button>
              <Button
                variant="primary"
                onClick={handleDecreaseDuration}
                disabled={isRunning || durationSeconds <= minDurationSeconds}
                aria-label="Diminuir tempo"
              >
                -
              </Button>
            </div>
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
              onClick={timerMode === "pomodoro" ? handleAbandon : handleDescansoAbandon}
              className="w-full h-[46px]"
            >
              ABANDONAR
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleStart}
              disabled={isStarting || (timerMode === "pomodoro" && !selectedSkill)}
              className={cn("w-full h-[46px]")}
            >
              COMEÇAR
            </Button>
          )}
        </div>

        {timerMode === "pomodoro" && (
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
        )}
      </section>
    </>
  );
}
