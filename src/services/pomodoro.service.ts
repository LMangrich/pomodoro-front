import { httpClient } from '@/src/utils/httpClient';
import type {
  PomodoroSession,
  StartPomodoroRequest,
  PomodoroStatusResponse,
  ValidationConstants,
} from '@/src/types/pomodoro.types';

export const pomodoroService = {
  start: (data: StartPomodoroRequest) =>
    httpClient.post<PomodoroSession>('/api/pomodoros/start', data),

  abandon: (pomodoroId: number) =>
    httpClient.put<PomodoroSession>(`/api/pomodoros/${pomodoroId}/abandon`),

  getStatus: () =>
    httpClient.get<PomodoroStatusResponse>('/api/pomodoros/status'),

  getValidationConstants: () =>
    httpClient.get<ValidationConstants>('/api/pomodoros/validation-constants'),
};
