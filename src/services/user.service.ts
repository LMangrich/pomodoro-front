import { httpClient } from '@/src/utils/httpClient';
import type { UserSkill, UserStats } from '@/src/types/user.types';

export const userService = {
  getSkills: (username: string) =>
    httpClient.get<UserSkill[]>(`/api/vault/inventory/${username}`),

  getStats: (username: string) =>
    httpClient.get<UserStats>(`/api/profile/summary/${username}`),
};
