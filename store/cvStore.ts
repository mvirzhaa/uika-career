// ============================================================
// UIKA Career Portal — CV Store (Zustand)
// ============================================================

import { create } from 'zustand';
import type { CV } from '@/types';

interface CVState {
  cvs: CV[];
  activeCv: CV | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCvs: (cvs: CV[]) => void;
  setActiveCv: (cv: CV | null) => void;
  addCv: (cv: CV) => void;
  updateCv: (id: string, cv: Partial<CV>) => void;
  removeCv: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCVStore = create<CVState>()((set) => ({
  cvs: [],
  activeCv: null,
  isLoading: false,
  error: null,
  
  setCvs: (cvs) => set({ cvs }),
  setActiveCv: (cv) => set({ activeCv: cv }),
  addCv: (cv) => set((state) => ({ cvs: [...state.cvs, cv] })),
  updateCv: (id, updatedData) => 
    set((state) => ({ 
      cvs: state.cvs.map(cv => cv.id === id ? { ...cv, ...updatedData } : cv),
      activeCv: state.activeCv?.id === id ? { ...state.activeCv, ...updatedData } : state.activeCv
    })),
  removeCv: (id) => 
    set((state) => ({ 
      cvs: state.cvs.filter(cv => cv.id !== id),
      activeCv: state.activeCv?.id === id ? null : state.activeCv
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
