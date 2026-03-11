'use client';

import { useState, useEffect } from 'react';
import { skillService } from '@/src/services/skill.service';
import { useUser } from '@/src/context/UserContext';
import type { Skill } from '@/src/types/skill.types';

export const useSkills = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useUser();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await skillService.listAll();
      setSkills(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar habilidades';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;
    fetchSkills();
  }, [isAuthenticated, isAuthLoading]);

  const calculateXp = async (skillId: number, durationMinutes: number) => {
    try {
      const result = await skillService.calculateXp(skillId, durationMinutes);
      return result.expectedXp;
    } catch {
      return 0;
    }
  };

  return { skills, isLoading, error, refetch: fetchSkills, calculateXp };
};


//todo - qnd fechar a tela, tb desiste do pomodoro