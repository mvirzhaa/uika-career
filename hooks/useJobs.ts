import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from '@/lib/api/job';
import { Job } from '@/types/job.types';

export const useJobs = () => {
  return useQuery<Job[], Error>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 1000 * 60 * 5, 
  });
};