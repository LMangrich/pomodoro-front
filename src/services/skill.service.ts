import { httpClient } from '@/src/utils/httpClient';
import type { Skill, CalculateXpResponse } from '@/src/types/skill.types';

export const skillService = {
  listAll: () =>
    httpClient.get<Skill[]>('/api/skill'),

  getById: (id: number) =>
    httpClient.get<Skill>(`/api/skill/${id}`),

  calculateXp: (skillId: number, durationMinutes: number) =>
    httpClient.get<CalculateXpResponse>(
      `/api/skill/calculate-xp?skillId=${skillId}&durationMinutes=${durationMinutes}`
    ),
};
