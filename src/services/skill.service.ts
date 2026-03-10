import { httpClient } from '@/src/utils/httpClient';
import type { Skill, CalculateXpResponse } from '@/src/types/skill.types';

export const skillService = {
  listAll: () =>
    httpClient.get<Skill[]>('/api/mastery/list'),

  getById: (id: number) =>
    httpClient.get<Skill>(`/api/mastery/${id}`),

  calculateXp: (skillId: number, durationMinutes: number) =>
    httpClient.get<CalculateXpResponse>(
      `/api/engine/xp-logic?skillId=${skillId}&durationMinutes=${durationMinutes}`
    ),
};
