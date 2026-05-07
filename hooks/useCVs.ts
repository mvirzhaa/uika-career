// ============================================================
// UIKA Career Portal — CV Hooks
// ============================================================

import { useCallback } from 'react';
import { useCVStore } from '@/store/cvStore';
import { cvsApi } from '@/lib/api/cvs';
import type { CreateCVDto, UpdateCVDto } from '@/types';

export function useCVs() {
  const { cvs, activeCv, isLoading, error, setCvs, setActiveCv, addCv, updateCv, removeCv, setLoading, setError } = useCVStore();

  const fetchCVs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cvsApi.getAll();
      setCvs(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat daftar CV');
    } finally {
      setLoading(false);
    }
  }, [setCvs, setLoading, setError]);

  const fetchCVById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await cvsApi.getById(id);
      setActiveCv(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data CV');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setActiveCv, setLoading, setError]);

  const createCV = async (dto: CreateCVDto) => {
    setLoading(true);
    setError(null);
    try {
      const newCv = await cvsApi.create(dto);
      addCv(newCv);
      return newCv;
    } catch (err: any) {
      setError(err.message || 'Gagal membuat CV');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editCV = async (id: string, dto: UpdateCVDto) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCv = await cvsApi.update(id, dto);
      updateCv(id, updatedCv);
      return updatedCv;
    } catch (err: any) {
      setError(err.message || 'Gagal mengupdate CV');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCV = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await cvsApi.delete(id);
      removeCv(id);
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus CV');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setPrimaryCV = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCv = await cvsApi.setPrimary(id);
      
      // Update the local state (unset other primaries, set this one)
      const updatedList = cvs.map(cv => ({
        ...cv,
        isPrimary: cv.id === id
      }));
      setCvs(updatedList);
      
      if (activeCv?.id === id) {
        setActiveCv(updatedCv);
      }
      
      return updatedCv;
    } catch (err: any) {
      setError(err.message || 'Gagal mengubah CV utama');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    cvs,
    activeCv,
    isLoading,
    error,
    fetchCVs,
    fetchCVById,
    createCV,
    editCV,
    deleteCV,
    setPrimaryCV,
  };
}
