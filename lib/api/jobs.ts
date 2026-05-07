// ============================================================
// UIKA Career Portal — Jobs API
// ============================================================

import apiClient from './client';
import type { Job, JobFilters, PaginatedResponse, ApiResponse } from '@/types';

export const jobsApi = {
  /**
   * Ambil daftar lowongan kerja dengan pagination & filter
   */
  getAll: async (filters?: JobFilters): Promise<PaginatedResponse<Job>> => {
    const { data } = await apiClient.get<PaginatedResponse<Job>>('/jobs', {
      params: filters,
    });
    return data;
  },

  /**
   * Ambil detail lowongan berdasarkan ID
   */
  getById: async (id: string): Promise<Job> => {
    const { data } = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return data.data;
  },
};
