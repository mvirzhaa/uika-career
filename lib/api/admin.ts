// ============================================================
// UIKA Career Portal — Admin API
// ============================================================

import apiClient from './client';
import type { User, Company, Job, PaginatedResponse, ApiResponse } from '@/types';

export interface AdminAnalytics {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalCompanies: number;
}

export const adminApi = {
  /**
   * Ambil statistik global dashboard admin
   */
  getAnalytics: async (): Promise<AdminAnalytics> => {
    const { data } = await apiClient.get<ApiResponse<AdminAnalytics>>('/admin/analytics');
    return data.data;
  },

  /**
   * Ambil daftar semua pengguna dengan filter dan pagination
   */
  getUsers: async (params?: { page?: number; limit?: number; role?: string; search?: string }): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get<PaginatedResponse<User>>('/admin/users', { params });
    return data;
  },

  /**
   * Manajemen Perusahaan
   */
  getCompanies: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Company>> => {
    const { data } = await apiClient.get<PaginatedResponse<Company>>('/admin/companies', { params });
    return data;
  },

  createCompany: async (dto: Partial<Company>): Promise<Company> => {
    const { data } = await apiClient.post<ApiResponse<Company>>('/admin/companies', dto);
    return data.data;
  },

  verifyCompany: async (id: string, isVerified: boolean): Promise<Company> => {
    const { data } = await apiClient.patch<ApiResponse<Company>>(`/admin/companies/${id}/verify`, { isVerified });
    return data.data;
  },

  deleteCompany: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/companies/${id}`);
    return data;
  },

  /**
   * Manajemen Lowongan
   */
  getJobs: async (params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<PaginatedResponse<Job>> => {
    const { data } = await apiClient.get<PaginatedResponse<Job>>('/admin/jobs', { params });
    return data;
  },

  createJob: async (dto: Partial<Job>): Promise<Job> => {
    const { data } = await apiClient.post<ApiResponse<Job>>('/admin/jobs', dto);
    return data.data;
  },

  deleteJob: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/jobs/${id}`);
    return data;
  },
};
