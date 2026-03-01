'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/src/services/user.service';
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
      const [statsData, skillsData] = await Promise.all([
        userService.getStats(username),
        userService.getSkills(username),
      ]);
      setStats(statsData);
      setSkills(skillsData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { stats, skills, isLoading, error, refetch: fetchProfile };
};
