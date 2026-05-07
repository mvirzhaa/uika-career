// ============================================================
// UIKA Career Portal — Cover Letters API
// ============================================================

import apiClient from './client';
import type { CoverLetter, CreateCoverLetterDto, PaginatedResponse, ApiResponse } from '@/types';

const unwrap = <T>(payload: T | ApiResponse<T>): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
};

const unwrapList = <T>(payload: T[] | PaginatedResponse<T> | ApiResponse<T[]>): T[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === 'object' && 'data' in payload && Array.isArray(payload.data)) {
    return payload.data;
  }
  return [];
};

export const coverLettersApi = {
  /**
   * Ambil daftar surat lamaran kerja user saat ini
   */
  getAll: async (): Promise<CoverLetter[]> => {
    const { data } = await apiClient.get<CoverLetter[] | PaginatedResponse<CoverLetter> | ApiResponse<CoverLetter[]>>('/cover-letters');
    return unwrapList(data);
  },

  /**
   * Ambil detail surat lamaran berdasarkan ID
   */
  getById: async (id: string): Promise<CoverLetter> => {
    const { data } = await apiClient.get<CoverLetter | ApiResponse<CoverLetter>>(`/cover-letters/${id}`);
    return unwrap(data);
  },

  /**
   * Buat surat lamaran baru
   */
  create: async (dto: CreateCoverLetterDto): Promise<CoverLetter> => {
    const { data } = await apiClient.post<CoverLetter | ApiResponse<CoverLetter>>('/cover-letters', dto);
    return unwrap(data);
  },

  /**
   * Hapus surat lamaran
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/cover-letters/${id}`);
  },
};
