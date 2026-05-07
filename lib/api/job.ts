import { Job } from '@/types/job.types';

// Sesuaikan dengan base URL API kamu
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1';

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch(`${API_URL}/jobs`);
  
  if (!response.ok) {
    throw new Error('Gagal mengambil data lowongan dari server');
  }
  
  const result = await response.json();
  // Asumsi format response API: { success: true, data: [...], meta: {...} }
  return result.data; 
};