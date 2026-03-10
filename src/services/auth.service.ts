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
    httpClient.post<AuthResponse>('/api/gate/enter', data),

  register: (data: RegisterRequest) =>
    httpClient.post<AuthResponse>('/api/onboarding/start', data),

  currentUser: () =>
    httpClient.get<AuthResponse>('/api/session/current'),

  logout: async () => {
    await httpClient.post('/api/session/end');
  },
};
