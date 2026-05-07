// ============================================================
// UIKA Career Portal — Auth API
// ============================================================

import apiClient from './client';
import type { LoginDto, RegisterDto, AuthResponse, RegisterResponse, User, AuthTokens } from '@/types';

export const authApi = {
  /**
   * Login dengan email & password
   */
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', dto);
    return data;
  },

  /**
   * Register pengguna baru
   */
  register: async (dto: RegisterDto): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', dto);
    return data;
  },

  /**
   * Logout (invalidate refresh token)
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Refresh access token
   */
  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const { data } = await apiClient.post<AuthTokens | { tokens: AuthTokens }>('/auth/refresh', { refreshToken });
    return 'tokens' in data ? data.tokens : data;
  },

  /**
   * Ambil profil user saat ini
   */
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },

  /**
   * Request reset password
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data;
  },

  /**
   * Reset password dengan token
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/reset-password', { token, newPassword });
    return data;
  },
};
