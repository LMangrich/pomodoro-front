"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { pomodoroService } from "@/src/services/pomodoro.service";
import { skillService } from "@/src/services/skill.service";
import { useUser } from "@/src/context/UserContext";
import type { ActivePomodoroStatus, ValidationConstants } from "@/src/types/pomodoro.types";
import {
  getInitialTimerMode,
  isDescansoActive as checkDescansoActive,
  isPomodoroActive as checkPomodoroActive,
  getSavedDescansoData,
  saveDescansoData,
  clearDescansoData,
  useStopTick,
  useClearCompletionTimer,
  useStartTick,
} from "@/src/utils/pomodoroHelpers";

interface PomodoroContextType {
  status: ActivePomodoroStatus | null;
  secondsRemaining: number;
  isRunning: boolean;
  isFinished: boolean;
  skillEmoji: string;        
  constants: ValidationConstants | null;
  isLoading: boolean;
  notifyStarted: (emoji?: string) => void;
  abandon: () => Promise<void>;
  clearStatus: () => void;
  syncStatus: () => Promise<void>;
  timerMode: "pomodoro" | "descanso";
  setTimerMode: (mode: "pomodoro" | "descanso") => void;
  startDescansoTimer: (durationSeconds: number) => void;
  isDescansoActive: () => boolean;
  isPomodoroActive: () => boolean;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useUser();
  const [status, setStatus] = useState<ActivePomodoroStatus | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [skillEmoji, setSkillEmoji] = useState("📚");
  const [constants, setConstants] = useState<ValidationConstants | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timerMode, setTimerMode] = useState<"pomodoro" | "descanso">(getInitialTimerMode());
  const [descansoActive, setDescansoActive] = useState(checkDescansoActive());

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncStatusRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const emojiMapRef = useRef<Map<string, string>>(new Map());
  const lastStatusRef = useRef<ActivePomodoroStatus | null>(null);

  const stopTick = useStopTick(tickRef);
  const clearCompletionTimer = useClearCompletionTimer(completionTimerRef);
  const startTick = useStartTick(stopTick, tickRef, setSecondsRemaining);

  const syncStatus = useCallback(async () => {
    if (isAuthLoading || !isAuthenticated) return;
    
    if (checkDescansoActive()) {
      return; 
    }

    try {
      const requestedAt = Date.now();
      const data = await pomodoroService.getStatus();
      const elapsedMs = Date.now() - requestedAt;

      if (!data || (data.isFinished && data.pomodoroStatus !== 'COMPLETED')) {
        clearCompletionTimer();
        stopTick();
        setStatus(null);
        setIsRunning(false);
        setIsFinished(false);
        return;
      }

      if (data.isFinished && data.pomodoroStatus === 'COMPLETED') {
        clearCompletionTimer();
        stopTick();
        setStatus(data);
        setSkillEmoji(emojiMapRef.current.get(data.skillName.toLowerCase()) ?? "📚");
        setIsFinished(true);
        setIsRunning(false);
        setTimerMode("descanso");
        return;
      }

      setStatus(data);
      setSecondsRemaining(data.secondsRemaining);
      setSkillEmoji(emojiMapRef.current.get(data.skillName.toLowerCase()) ?? "📚");
      setIsRunning(true);
      setIsFinished(false);
      startTick();
      lastStatusRef.current = data;

      clearCompletionTimer();
      const msRemaining = Math.max(0, data.secondsRemaining * 1000 - elapsedMs);
      completionTimerRef.current = setTimeout(() => {
        console.log('[Pomodoro] completion timer fired');
        const last = lastStatusRef.current;
        if (!last || !isAuthenticated) return;
        stopTick();
        setIsRunning(false);
        setIsFinished(true);
        pomodoroService.getStatus().then((final) => {
          if (final && final.isFinished && final.pomodoroStatus === 'COMPLETED') {
            setStatus(final);
          }
        }).catch(() => {});
      }, msRemaining);
    } catch {
    }
  }, [startTick, stopTick, clearCompletionTimer, isAuthenticated, isAuthLoading]);

  useEffect(() => {
    syncStatusRef.current = syncStatus;
  }, [syncStatus]);

  // Boot

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;
    let cancelled = false;
    async function boot() {
      // Check descanso timer FIRST, synchronously from localStorage
      const savedDescanso = getSavedDescansoData();
      const descansoIsActive = savedDescanso && savedDescanso.endTime > Date.now();
      
      // Then fetch data
      const [consts, allSkills] = await Promise.all([
        pomodoroService.getValidationConstants().catch(() => null),
        skillService.listAll().catch(() => []),
      ]);
      if (cancelled) return;
      if (consts) setConstants(consts);
      emojiMapRef.current = new Map(allSkills.map((s) => [s.name.toLowerCase(), s.emojString ?? "📚"]));
      
      // Now restore descanso timer if active
      if (descansoIsActive && savedDescanso) {
        const msRemaining = savedDescanso.endTime - Date.now();
        const secondsRemaining = Math.ceil(msRemaining / 1000);
        setSecondsRemaining(secondsRemaining);
        setIsRunning(true);
        setDescansoActive(true);
        startTick();
        
        clearCompletionTimer();
        completionTimerRef.current = setTimeout(() => {
          stopTick();
          setIsRunning(false);
          setIsFinished(true);
          setDescansoActive(false);
          setTimerMode("pomodoro"); // Reset back to pomodoro when descanso finishes
          clearDescansoData();
        }, msRemaining);
      } else {
        // Clean up expired localStorage entry
        clearDescansoData();
        // Only sync if no active descanso timer
        await syncStatusRef.current();
      }
      
      if (cancelled) return;
      setIsLoading(false);
    }
    boot();
    return () => { cancelled = true; };
  }, [isAuthenticated, isAuthLoading, startTick, stopTick, clearCompletionTimer]);

  // Cleanup on unmount

  useEffect(() => {
    return () => {
      stopTick();
      clearCompletionTimer();
    };
  }, [stopTick, clearCompletionTimer]);

  // Actions

  const notifyStarted = useCallback((emoji?: string) => {
    if (emoji) setSkillEmoji(emoji);
    syncStatus();
  }, [syncStatus]);

  const abandon = useCallback(async () => {
    if (!status) return;
    await pomodoroService.abandon(status.pomodoroId);
    clearCompletionTimer();
    stopTick();
    setStatus(null);
    setSecondsRemaining(0);
    setIsRunning(false);
    setIsFinished(false);
  }, [status, stopTick, clearCompletionTimer]);

  const clearStatus = useCallback(() => {
    clearCompletionTimer();
    stopTick();
    setStatus(null);
    setSecondsRemaining(0);
    setIsRunning(false);
    setIsFinished(false);
    clearDescansoData();
  }, [clearCompletionTimer, stopTick]);

  const startDescansoTimer = useCallback((durationSeconds: number) => {
    const now = Date.now();
    const endTime = now + (durationSeconds * 1000);
    
    setSecondsRemaining(durationSeconds);
    setIsRunning(true);
    setDescansoActive(true);
    startTick();
    
    // Persist to localStorage for reload survival
    saveDescansoData(endTime);
    
    const msRemaining = durationSeconds * 1000;
    clearCompletionTimer();
    completionTimerRef.current = setTimeout(() => {
      stopTick();
      setIsRunning(false);
      setIsFinished(true);
      setDescansoActive(false);
      setTimerMode("pomodoro"); 
      clearDescansoData();
    }, msRemaining);
  }, [startTick, stopTick, clearCompletionTimer]);

  const isPomodoroActiveCallback = useCallback(() => {
    return checkPomodoroActive(isRunning, timerMode);
  }, [isRunning, timerMode]);

  const isDescansoActiveCallback = useCallback(() => {
    return descansoActive;
  }, [descansoActive]);

  return (
    <PomodoroContext.Provider
      value={{
        status,
        secondsRemaining,
        isRunning,
        isFinished,
        skillEmoji,
        constants,
        isLoading,
        notifyStarted,
        abandon,
        clearStatus,
        syncStatus,
        timerMode,
        setTimerMode,
        startDescansoTimer,
        isDescansoActive: isDescansoActiveCallback,
        isPomodoroActive: isPomodoroActiveCallback,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = (): PomodoroContextType => {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error("usePomodoro must be used inside <PomodoroProvider>");
  return ctx;
};
