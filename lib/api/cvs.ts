// ============================================================
// UIKA Career Portal — CVs API
// ============================================================

import apiClient from './client';
import type { CV, CVSection, CreateCVDto, UpdateCVDto, ApiResponse, PaginatedResponse } from '@/types';

const unwrap = <T>(payload: T | ApiResponse<T>): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
};

const unwrapList = <T>(payload: T[] | ApiResponse<T[]> | PaginatedResponse<T>): T[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === 'object' && 'data' in payload && Array.isArray(payload.data)) {
    return payload.data;
  }
  return [];
};

export const cvsApi = {
  /**
   * Ambil semua CV milik user yang sedang login
   */
  getAll: async (): Promise<CV[]> => {
    const { data } = await apiClient.get<CV[] | ApiResponse<CV[]> | PaginatedResponse<CV>>('/cvs');
    return unwrapList(data);
  },

  /**
   * Ambil CV berdasarkan ID
   */
  getById: async (id: string): Promise<CV> => {
    const { data } = await apiClient.get<CV | ApiResponse<CV>>(`/cvs/${id}`);
    return unwrap(data);
  },

  /**
   * Buat CV baru
   */
  create: async (dto: CreateCVDto): Promise<CV> => {
    const { data } = await apiClient.post<CV | ApiResponse<CV>>('/cvs', dto);
    return unwrap(data);
  },

  /**
   * Update CV
   */
  update: async (id: string, dto: UpdateCVDto): Promise<CV> => {
    const { data } = await apiClient.patch<CV | ApiResponse<CV>>(`/cvs/${id}`, dto);
    return unwrap(data);
  },

  /**
   * Hapus CV
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/cvs/${id}`);
  },

  /**
   * Set CV sebagai primer
   */
  setPrimary: async (id: string): Promise<CV> => {
    const { data } = await apiClient.patch<CV | ApiResponse<CV>>(`/cvs/${id}/set-primary`);
    return unwrap(data);
  },

  /**
   * Generate share link
   */
  generateShareLink: async (id: string): Promise<{ shareUrl: string; shareToken: string }> => {
    const { data } = await apiClient.post(`/cvs/${id}/share`);
    return data;
  },

  /**
   * Export PDF
   */
  exportPdf: async (id: string): Promise<Blob> => {
    const { data } = await apiClient.get(`/cvs/${id}/export-pdf`, {
      responseType: 'blob',
    });
    return data;
  },

  // ── CV Sections ────────────────────────────────────────────

  sections: {
    getAll: async (cvId: string): Promise<CVSection[]> => {
      const { data } = await apiClient.get<CVSection[] | ApiResponse<CVSection[]>>(`/cvs/${cvId}/sections`);
      return unwrapList(data);
    },

    create: async (cvId: string, section: Partial<CVSection>): Promise<CVSection> => {
      const { data } = await apiClient.post<CVSection | ApiResponse<CVSection>>(`/cvs/${cvId}/sections`, section);
      return unwrap(data);
    },

    update: async (cvId: string, sectionId: string, section: Partial<CVSection>): Promise<CVSection> => {
      const { data } = await apiClient.patch<CVSection | ApiResponse<CVSection>>(
        `/cvs/${cvId}/sections/${sectionId}`,
        section
      );
      return unwrap(data);
    },

    delete: async (cvId: string, sectionId: string): Promise<void> => {
      await apiClient.delete(`/cvs/${cvId}/sections/${sectionId}`);
    },

    reorder: async (cvId: string, orderedIds: string[]): Promise<void> => {
      await apiClient.patch(`/cvs/${cvId}/sections/reorder`, { orderedIds });
    },
  },
};
