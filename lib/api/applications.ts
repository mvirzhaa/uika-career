// ============================================================
// UIKA Career Portal — Applications API
// ============================================================

import apiClient from './client';
import type { Application, CreateApplicationDto, PaginatedResponse, ApiResponse } from '@/types';

export const applicationsApi = {
  /**
   * Ambil daftar lamaran kerja user saat ini
   */
  getMyApplications: async (): Promise<PaginatedResponse<Application>> => {
    const { data } = await apiClient.get<PaginatedResponse<Application>>('/applications');
    return data;
  },

  /**
   * Ambil detail lamaran kerja berdasarkan ID
   */
  getById: async (id: string): Promise<Application> => {
    const { data } = await apiClient.get<ApiResponse<Application>>(`/applications/${id}`);
    return data.data;
  },

  /**
   * Lamar pekerjaan (submit application)
   */
  apply: async (dto: CreateApplicationDto): Promise<Application> => {
    const { data } = await apiClient.post<ApiResponse<Application>>('/applications', dto);
    return data.data;
  },

  /**
   * Tarik lamaran (withdraw application)
   */
  withdraw: async (id: string): Promise<Application> => {
    const { data } = await apiClient.patch<ApiResponse<Application>>(`/applications/${id}/withdraw`);
    return data.data;
  },
};
