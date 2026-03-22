/**
 * usePomodorTimer Hook
 * Encapsulates all Pomodoro timer business logic and handlers
 */

import { useState, useCallback, useEffect } from "react";
import { pomodoroService } from "@/src/services/pomodoro.service";
import { skillService } from "@/src/services/skill.service";
import type { Skill } from "@/src/types/skill.types";
import {
  formatTime,
  getDurationDraftParts,
  updateDurationDraftPart,
  parseDurationInput,
  increaseDuration,
  decreaseDuration,
  calculateProgress,
  getDurationConstants,
} from "../app/(profile)/pomodoro/utils/pomodoroTimerUtils";

interface UsePomodoroTimerProps {
  minDuration: number;
  maxDuration: number;
  defaultDuration: number;
  isRunning: boolean;
  timerMode: "pomodoro" | "descanso";
  status: { totalDurationMinutes: number; expectedXp: number; skillName: string } | null;
  secondsRemaining: number;
  notifyStarted: (emoji?: string) => void;
  abandon: () => Promise<void>;
  startDescansoTimer: (seconds: number) => void;
}

export const usePomodoroTimer = ({
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
}: UsePomodoroTimerProps) => {
  const {
    minDurationSeconds,
    maxDurationSeconds,
    defaultDurationSeconds,
    durationStepSeconds,
  } = getDurationConstants(minDuration, maxDuration, defaultDuration);

  const [durationOverride, setDurationOverride] = useState<number | null>(null);
  const [durationDraft, setDurationDraft] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewXp, setPreviewXp] = useState<number | null>(null);

  const durationSeconds = durationOverride ?? defaultDurationSeconds;
  const durationMinutes = durationSeconds / 60;
  const totalSeconds = status ? status.totalDurationMinutes * 60 : durationSeconds;

  // Fetch XP preview when skill or duration changes
  useEffect(() => {
    if (!selectedSkill || isRunning) return;
    let cancelled = false;
    skillService
      .calculateXp(selectedSkill.id, durationMinutes)
      .then((res) => {
        if (!cancelled) setPreviewXp(res.expectedXp);
      })
      .catch(() => {
        if (!cancelled) setPreviewXp(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedSkill, durationMinutes, isRunning]);

  // Duration input handlers
  const commitDurationInput = useCallback(() => {
    const nextDuration = parseDurationInput(
      durationDraft ??
        formatTime(Math.floor(durationSeconds / 60), durationSeconds % 60),
      durationSeconds,
      {
        minDurationSeconds,
        maxDurationSeconds,
        durationStepSeconds,
        defaultDurationSeconds,
      }
    );
    setDurationOverride(nextDuration);
    setDurationDraft(
      formatTime(Math.floor(nextDuration / 60), nextDuration % 60)
    );
  }, [
    durationDraft,
    durationSeconds,
    minDurationSeconds,
    maxDurationSeconds,
    durationStepSeconds,
    defaultDurationSeconds,
  ]);

  const handleDurationDraftChange = useCallback(
    (rawValue: string) => {
      setDurationDraft(
        updateDurationDraftPart(rawValue, durationDraft, durationSeconds)
      );
    },
    [durationDraft, durationSeconds]
  );

  const handleIncreaseDuration = useCallback(() => {
    if (isRunning) return;
    setDurationDraft(null);
    setDurationOverride((prev) =>
      increaseDuration(prev, defaultDurationSeconds, maxDurationSeconds)
    );
  }, [isRunning, defaultDurationSeconds, maxDurationSeconds]);

  const handleDecreaseDuration = useCallback(() => {
    if (isRunning) return;
    setDurationDraft(null);
    setDurationOverride((prev) =>
      decreaseDuration(prev, defaultDurationSeconds, minDurationSeconds)
    );
  }, [isRunning, defaultDurationSeconds, minDurationSeconds]);

  // Timer control handlers
  const handleStart = useCallback(async () => {
    if (timerMode === "pomodoro" && !selectedSkill) return;

    if (timerMode === "pomodoro") {
      try {
        await pomodoroService.start({
          skillId: selectedSkill!.id,
          durationTime: durationMinutes,
        });
        notifyStarted(
          (
            selectedSkill as typeof selectedSkill & { emojString?: string }
          ).emojString
        );
      } catch (err) {
        alert(
          `Erro ao iniciar pomodoro: ${
            err instanceof Error ? err.message : "Desconhecido"
          }`
        );
      }
    } else {
      startDescansoTimer(durationSeconds);
    }
  }, [timerMode, selectedSkill, durationMinutes, durationSeconds, notifyStarted, startDescansoTimer]);

  const handleAbandon = useCallback(async () => {
    try {
      await abandon();
      setSelectedSkill(null);
    } catch (err) {
      console.error("Failed to abandon pomodoro:", err);
    }
  }, [abandon]);

  const handleChooseSkill = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(false);
  }, []);

  // Computed values
  const progressPercent = calculateProgress(totalSeconds, secondsRemaining);
  const expectedXp = isRunning ? (status?.expectedXp ?? 0) : (previewXp ?? 0);
  const activeSkillName = status?.skillName ?? selectedSkill?.name ?? "";
  const { minutesPart, secondsPart } = getDurationDraftParts(
    durationDraft,
    durationSeconds
  );

  return {
    // State
    durationSeconds,
    durationMinutes,
    minDurationSeconds,
    maxDurationSeconds,
    selectedSkill,
    isModalOpen,
    previewXp,
    durationDraft,

    // State setters
    setDurationOverride,
    setDurationDraft,
    setSelectedSkill,
    setIsModalOpen,

    // Handlers
    commitDurationInput,
    handleDurationDraftChange,
    handleIncreaseDuration,
    handleDecreaseDuration,
    handleStart,
    handleAbandon,
    handleChooseSkill,

    // Computed values
    progressPercent,
    expectedXp,
    activeSkillName,
    minutesPart,
    secondsPart,
  };
};
