import { httpClient } from '@/src/utils/httpClient';
import type { UserData } from '@/src/types/user.types';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  name: string;
}

interface AuthResponse {
  message: string;
  user: UserData;
}

export const authService = {
  login: (data: LoginRequest) =>
    httpClient.post<AuthResponse>('/api/auth/login', data),

  register: (data: RegisterRequest) =>
    httpClient.post<AuthResponse>('/api/auth/register', data),

  currentUser: () =>
    httpClient.get<AuthResponse>('/api/auth/current-user'),

  logout: async () => {
    await httpClient.post('/api/auth/logout');
  },
};
