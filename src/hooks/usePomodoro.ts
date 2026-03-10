'use client';

import { useState, useEffect, useCallback } from 'react';
import { pomodoroService } from '@/src/services/pomodoro.service';
import { skillService } from '@/src/services/skill.service';
import type { PomodoroSession, ValidationConstants } from '@/src/types/pomodoro.types';

export const usePomodoro = () => {
  const [activePomodoro, setActivePomodoro] = useState<PomodoroSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [constants, setConstants] = useState<ValidationConstants | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await pomodoroService.getStatus();
      setActivePomodoro(data ? { id: data.pomodoroId, skillId: 0, durationTime: data.totalDurationMinutes, status: data.pomodoroStatus, startedAt: '' } : null);
    } catch {
      // no active pomodoro or not authenticated yet
    }
  }, []);

  useEffect(() => {
    pomodoroService
      .getValidationConstants()
      .then(setConstants)
      .catch(() => {});
    fetchStatus();
  }, [fetchStatus]);

  const startPomodoro = async (skillId: number, durationTime: number) => {
    console.log('[usePomodoro] startPomodoro called with:', { skillId, durationTime });
    setIsLoading(true);
    setError(null);
    try {
      const session = await pomodoroService.start({ skillId, durationTime });
      console.log('[usePomodoro] Pomodoro session created:', session);
      setActivePomodoro(session);
      return session;
    } catch (err) {
      console.error('[usePomodoro] Error starting pomodoro:', err);
      const message = err instanceof Error ? err.message : 'Erro ao iniciar pomodoro';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const abandonPomodoro = async () => {
    if (!activePomodoro) return;
    setIsLoading(true);
    setError(null);
    try {
      await pomodoroService.abandon(activePomodoro.id);
      setActivePomodoro(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao abandonar pomodoro');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateExpectedXp = async (skillId: number, durationMinutes: number) => {
    try {
      const result = await skillService.calculateXp(skillId, durationMinutes);
      return result.expectedXp;
    } catch {
      return 0;
    }
  };

  return {
    activePomodoro,
    isLoading,
    error,
    constants,
    startPomodoro,
    abandonPomodoro,
    calculateExpectedXp,
    refreshStatus: fetchStatus,
  };
};
