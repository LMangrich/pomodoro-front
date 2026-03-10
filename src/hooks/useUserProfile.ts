'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/src/services/user.service';
import { skillService } from '@/src/services/skill.service';
import type { UserStats, UserSkill } from '@/src/types/user.types';

export const useUserProfile = (username: string | null | undefined) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!username) return;
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, skillsData, allSkills] = await Promise.all([
        userService.getStats(username),
        userService.getSkills(username),
        skillService.listAll().catch(() => []),
      ]);
      const emojiMap = new Map(allSkills.map((s) => [s.name.toLowerCase(), s.emojString]));
      const enriched = skillsData.map((s) => ({
        ...s,
        emojString: s.emojString ?? emojiMap.get(s.skillName.toLowerCase()),
      }));
      setStats(statsData);
      setSkills(enriched);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { stats, skills, isLoading, error, refetch: fetchProfile };
};
