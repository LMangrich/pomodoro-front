import { httpClient } from '@/src/utils/httpClient';
import type { UserSkill, UserStats } from '@/src/types/user.types';

export const userService = {
  getSkills: (username: string) =>
    httpClient.get<UserSkill[]>(`/api/user/${username}/skills`),

  getStats: (username: string) =>
    httpClient.get<UserStats>(`/api/user/${username}/stats`),
};
