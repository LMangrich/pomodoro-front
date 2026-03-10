'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/src/services/auth.service';
import { useUser } from '@/src/context/UserContext';

export const useAuth = () => {
  const router = useRouter();
  const { setUserData, clearUserData } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ username, password });
      
      if (!response.user) {
        throw new Error('Invalid response from server: missing user data');
      }

      setUserData(response.user);
      router.push('/pomodoro');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Usuário ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    username: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({ name, email, username, password });
      
      if (!response.user) {
        throw new Error('Invalid response from server: missing user data');
      }

      setUserData(response.user);
      router.push('/pomodoro');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    clearUserData();
    router.push('/login');
  };

  return { login, register, logout, isLoading, error };
};
