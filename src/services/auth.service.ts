import { httpClient, clearToken } from '@/src/utils/httpClient';
import type { AuthResponse, UserData } from '@/src/types/user.types';

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

interface CurrentUserResponse {
  user: UserData;
}

export const authService = {
  login: (data: LoginRequest) =>
    httpClient.post<AuthResponse>('/api/auth/login', data),

  register: (data: RegisterRequest) =>
    httpClient.post<AuthResponse>('/api/auth/register', data),

  currentUser: () =>
    httpClient.get<CurrentUserResponse>('/api/auth/current-user'),

  logout: async () => {
    await httpClient.post('/api/auth/logout', {});
    clearToken();
  },
};
