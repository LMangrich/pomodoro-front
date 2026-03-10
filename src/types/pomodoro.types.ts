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

export interface ActivePomodoroStatus {
  pomodoroId: number;
  secondsRemaining: number;
  isFinished: boolean;
  pomodoroStatus: PomodoroStatus;
  skillName: string;
  totalDurationMinutes: number;
  expectedXp: number;
  xpNotification: string | null;
}

export interface ValidationConstants {
  minDuration: number;
  maxDuration: number;
  defaultDuration: number;
}
