"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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

  const minDuration = constants?.minDuration ?? 1;
  const maxDuration = constants?.maxDuration ?? 120;
  const defaultDuration = constants?.defaultDuration ?? 25;
  const durationStepMinutes = 5;
  const minDurationSeconds = minDuration * 60;
  const maxDurationSeconds = maxDuration * 60;
  const defaultDurationSeconds = defaultDuration * 60;
  const durationStepSeconds = durationStepMinutes * 60;
  const [durationOverride, setDurationOverride] = useState<number | null>(null);
  const [durationDraft, setDurationDraft] = useState<string | null>(null);
  const durationSeconds = durationOverride ?? defaultDurationSeconds;
  const durationMinutes = durationSeconds / 60;

  const totalSeconds = status ? status.totalDurationMinutes * 60 : durationSeconds;

  const displayMinutes = isRunning ? Math.floor(secondsRemaining / 60) : Math.floor(durationSeconds / 60);
  const displaySeconds = isRunning ? secondsRemaining % 60 : durationSeconds % 60;

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewXp, setPreviewXp] = useState<number | null>(null);
  const minutesInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!selectedSkill || isRunning) return;
    let cancelled = false;
    skillService.calculateXp(selectedSkill.id, durationMinutes)
      .then((res) => { if (!cancelled) setPreviewXp(res.expectedXp); })
      .catch(() => { if (!cancelled) setPreviewXp(null); });
    return () => { cancelled = true; };
  }, [selectedSkill, durationMinutes, isRunning]);

  const formatTime = (mins: number, secs: number) =>
    `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  const getDurationDraftParts = () => {
    const baseDraft = durationDraft ?? formatTime(Math.floor(durationSeconds / 60), durationSeconds % 60);
    const [minutesPart = "", secondsPart = ""] = baseDraft.split(":");

    return {
      minutesPart,
      secondsPart,
    };
  };

  const updateDurationDraftPart = (rawValue: string) => {
    const { secondsPart } = getDurationDraftParts();
    const sanitizedValue = rawValue.replace(/\D/g, "").slice(0, 3);
    setDurationDraft(`${sanitizedValue}:${secondsPart || "00"}`);
  };

  const parseDurationInput = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return defaultDurationSeconds;

    const onlyDigits = trimmedValue.replace(/\D/g, "");

    if (!onlyDigits) return durationSeconds;

    let minutes = 0;
    let seconds = 0;

    if (trimmedValue.includes(":")) {
      const [minutesPart = "0", secondsPart = "0"] = trimmedValue.split(":");
      minutes = Number.parseInt(minutesPart.replace(/\D/g, "") || "0", 10);
      seconds = Number.parseInt(secondsPart.replace(/\D/g, "") || "0", 10);
    } else if (onlyDigits.length <= 3) {
      minutes = Number.parseInt(onlyDigits, 10);
    } else {
      minutes = Number.parseInt(onlyDigits.slice(0, -2), 10);
      seconds = Number.parseInt(onlyDigits.slice(-2), 10);
    }

    const rawSeconds = (minutes * 60) + seconds;
    const clampedSeconds = Math.min(maxDurationSeconds, Math.max(minDurationSeconds, rawSeconds));
    const normalizedSeconds = Math.round(clampedSeconds / durationStepSeconds) * durationStepSeconds;

    return Math.min(maxDurationSeconds, Math.max(minDurationSeconds, normalizedSeconds));
  };

  const commitDurationInput = () => {
    const nextDuration = parseDurationInput(durationDraft ?? formatTime(Math.floor(durationSeconds / 60), durationSeconds % 60));
    setDurationOverride(nextDuration);
    setDurationDraft(formatTime(Math.floor(nextDuration / 60), nextDuration % 60));
  };

  const focusMinutesInput = () => {
    if (isRunning) return;
    const input = minutesInputRef.current;
    if (!input) return;

    input.focus();
    const cursorPosition = input.value.length;
    input.setSelectionRange(cursorPosition, cursorPosition);
  };

  const handleStart = async () => {
    if (!selectedSkill) return;
    try {
      await pomodoroService.start({
        skillId: selectedSkill.id,
        durationTime: durationMinutes,
      });
      notifyStarted((selectedSkill as (typeof selectedSkill & { emojString?: string })).emojString);
    } catch (err) {
      alert(`Erro ao iniciar pomodoro: ${err instanceof Error ? err.message : "Desconhecido"}`);
    }
  };

  const handleIncreaseDuration = () => {
    if (isRunning) return;
    setDurationDraft(null);
    setDurationOverride((prev) => {
      const current = prev ?? defaultDurationSeconds;
      return Math.min(maxDurationSeconds, current + (5 * 60));
    });
  };

  const handleDecreaseDuration = () => {
    if (isRunning) return;
    setDurationDraft(null);
    setDurationOverride((prev) => {
      const current = prev ?? defaultDurationSeconds;
      return Math.max(minDurationSeconds, current - (5 * 60));
    });
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
  const { minutesPart, secondsPart } = getDurationDraftParts();

  return (
    <>
      <ChooseSkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChooseSkill={handleChooseSkill}
      />
      <section className="flex flex-col items-center gap-12 w-full">
        <div className="w-full max-w-[623px] bg-primary border border-border rounded-[20px] px-8 py-7 flex flex-col items-center gap-8 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          <div className="flex flex-row w-full justify-center gap-4">
            <Button
              variant="primary"
              className={cn("px-7 py-2 text-14 hover:opacity-100 border-none transition-colors")}
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

          <div className="w-full flex items-center justify-center  gap-4">
            <div
              className={cn(" w-full border rounded-[12px] px-10 py-3 min-w-[290px] text-center",
                isRunning ? "border-transparent" : "border-dashed border-button-primary/70",
              )}
              onClick={focusMinutesInput}
            >
              {isRunning ? (
                <div className="text-off-white text-[96px] font-bold leading-none tracking-tight select-none">
                  {formatTime(displayMinutes, displaySeconds)}
                </div>
              ) : (
                <div className="w-full flex items-center justify-center gap-3 text-off-white text-[96px] font-bold leading-none tracking-tight">
                  <input
                    ref={minutesInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    value={minutesPart}
                    onChange={(event) => {
                      updateDurationDraftPart(event.target.value);
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

            <div className="flex flex-col gap-2">
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
              onClick={handleAbandon}
              className="w-full h-[56px]"
            >
              ABANDONAR
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleStart}
              disabled={!selectedSkill}
              className={cn("w-full h-[56px]", !selectedSkill && "opacity-50 cursor-not-allowed")}
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
