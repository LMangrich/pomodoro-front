export type PomodoroStatus = 'RUNNING' | 'COMPLETED' | 'ABANDONED';

export interface PomodoroSession {
  id: number;
  skillId: number;
  skillName?: string;
  durationTime: number;
  status: PomodoroStatus;
  startedAt: string;
  finishedAt?: string;
  xpEarned?: number;
}

export interface StartPomodoroRequest {
  skillId: number;
  durationTime: number;
}

export interface PomodoroStatusResponse {
  pomodoro: PomodoroSession | null;
  hasActivePomodoro: boolean;
}

export interface ValidationConstants {
  minDuration: number;
  maxDuration: number;
  defaultDuration: number;
}
