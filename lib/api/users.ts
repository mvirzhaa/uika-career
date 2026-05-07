// ============================================================
// UIKA Career Portal — Users API
// ============================================================

import apiClient from './client';
import type { User, UserProfile, ApiResponse } from '@/types';

const unwrap = <T>(payload: T | ApiResponse<T>): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
};

export const usersApi = {
  /**
   * Update profil dasar user
   */
  updateProfile: async (data: Partial<UserProfile>): Promise<User> => {
    const response = await apiClient.patch<User | ApiResponse<User>>('/users/profile', data);
    return unwrap(response.data);
  },

  /**
   * Hapus Akun
   */
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/users/account');
  },
};
