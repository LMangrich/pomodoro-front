import { httpClient } from '@/src/utils/httpClient';
import type {
  PomodoroSession,
  StartPomodoroRequest,
  ActivePomodoroStatus,
  ValidationConstants,
} from '@/src/types/pomodoro.types';

export const pomodoroService = {
  start: (data: StartPomodoroRequest) =>
    httpClient.post<PomodoroSession>('/api/pomodoros/start', data),

  abandon: (pomodoroId: number) =>
    httpClient.put<void>(`/api/pomodoros/${pomodoroId}/abandon`),

  getStatus: async (): Promise<ActivePomodoroStatus | null> => {
    const data = await httpClient.get<ActivePomodoroStatus | Record<string, never>>('/api/pomodoros/status');
    if (!data || !('pomodoroId' in data)) return null;
    return data as ActivePomodoroStatus;
  },

  getValidationConstants: () =>
    httpClient.get<ValidationConstants>('/api/pomodoros/validation-constants'),
};
