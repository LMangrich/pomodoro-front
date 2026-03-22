/**
 * Helper functions for Pomodoro context state management
 */

import { useCallback, SetStateAction, Dispatch, RefObject } from "react";

const DESCANSO_KEY = "pomodoro_descanso_timer";

export interface DescansoData {
  startedAt: number;
  endTime: number;
}

/**
 * Timer management hooks
 */

export const useStopTick = (tickRef: RefObject<ReturnType<typeof setInterval> | null>) => {
  return useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, [tickRef]);
};

export const useClearCompletionTimer = (
  completionTimerRef: RefObject<ReturnType<typeof setTimeout> | null>
) => {
  return useCallback(() => {
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
  }, [completionTimerRef]);
};

export const useStartTick = (
  stopTick: () => void,
  tickRef: RefObject<ReturnType<typeof setInterval> | null>,
  setSecondsRemaining: Dispatch<SetStateAction<number>>
) => {
  return useCallback(() => {
    stopTick();
    tickRef.current = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
  }, [stopTick, tickRef, setSecondsRemaining]);
};

/**
 * Gets the initial timer mode from localStorage
 * Used during state initialization to prevent UI flicker
 */
export const getInitialTimerMode = (): "pomodoro" | "descanso" => {
  if (typeof window === "undefined") return "pomodoro";
  try {
    const saved = localStorage.getItem(DESCANSO_KEY);
    if (saved) {
      const descansoData = JSON.parse(saved);
      if (descansoData.endTime && descansoData.endTime > Date.now()) {
        return "descanso";
      }
    }
  } catch {
  }
  return "pomodoro";
};

/**
 * Checks if a descanso timer is currently active
 */
export const isDescansoActive = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem(DESCANSO_KEY);
    if (saved) {
      const descansoData = JSON.parse(saved);
      return descansoData.endTime && descansoData.endTime > Date.now();
    }
  } catch {
  }
  return false;
};

/**
 * Checks if a pomodoro is currently running
 * A pomodoro is active when we're in pomodoro mode and it's running (checked via context state)
 * This is a helper that checks if descanso is NOT active
 */
export const isPomodoroActive = (isRunning: boolean, timerMode: string): boolean => {
  return isRunning && timerMode === "pomodoro" && !isDescansoActive();
};

/**
 * Retrieves saved descanso timer data from localStorage
 */
export const getSavedDescansoData = (): DescansoData | null => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(DESCANSO_KEY);
    if (saved) {
      const descansoData = JSON.parse(saved);
      if (descansoData.startedAt && descansoData.endTime) {
        return descansoData;
      }
    }
  } catch {
  }
  return null;
};

/**
 * Saves descanso timer data to localStorage
 */
export const saveDescansoData = (endTime: number): void => {
  if (typeof window === "undefined") return;
  const now = Date.now();
  try {
    localStorage.setItem(DESCANSO_KEY, JSON.stringify({ startedAt: now, endTime }));
  } catch {
  }
};

/**
 * Clears descanso timer data from localStorage
 */
export const clearDescansoData = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DESCANSO_KEY);
  } catch {
    // Storage error
  }
};
