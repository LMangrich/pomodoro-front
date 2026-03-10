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
import type { ActivePomodoroStatus, ValidationConstants } from "@/src/types/pomodoro.types";

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
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<ActivePomodoroStatus | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [skillEmoji, setSkillEmoji] = useState("📚");
  const [constants, setConstants] = useState<ValidationConstants | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncStatusRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const emojiMapRef = useRef<Map<string, string>>(new Map());
  const lastStatusRef = useRef<ActivePomodoroStatus | null>(null);

  // Helpers

  const stopTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const clearCompletionTimer = useCallback(() => {
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
  }, []);

  const startTick = useCallback(() => {
    stopTick();
    tickRef.current = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
  }, [stopTick]);

  const syncStatus = useCallback(async () => {
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
        if (!last) return;
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
  }, [startTick, stopTick, clearCompletionTimer]);

  useEffect(() => {
    syncStatusRef.current = syncStatus;
  }, [syncStatus]);

  // Boot

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      // Build the emoji map FIRST so syncStatus can look up icons immediately
      const [consts, allSkills] = await Promise.all([
        pomodoroService.getValidationConstants().catch(() => null),
        skillService.listAll().catch(() => []),
      ]);
      if (cancelled) return;
      if (consts) setConstants(consts);
      emojiMapRef.current = new Map(allSkills.map((s) => [s.name.toLowerCase(), s.emojString ?? "📚"]));
      // Now sync — the map is ready, so skill emoji will resolve correctly
      await syncStatus();
      if (cancelled) return;
      setIsLoading(false);
    }
    boot();
    return () => { cancelled = true; };
  }, [syncStatus]);

  // Cleanup on unmount

  useEffect(() => {
    return () => {
      stopTick();
      clearCompletionTimer();
    };
  }, [stopTick, clearCompletionTimer]);

  // Abandon on tab/window close — keepalive ensures the request survives page unload
  const statusRef = useRef<ActivePomodoroStatus | null>(null);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const current = statusRef.current;
      if (!current) return;
      fetch(`/api/focus/cancel/${current.pomodoroId}`, {
        method: 'PUT',
        keepalive: true,
        credentials: 'include',
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

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
    setSkillEmoji("📚");
  }, [status, stopTick, clearCompletionTimer]);

  const clearStatus = useCallback(() => {
    clearCompletionTimer();
    setStatus(null);
    setSecondsRemaining(0);
    setIsRunning(false);
    setIsFinished(false);
    setSkillEmoji("📚");
  }, [clearCompletionTimer]);

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
