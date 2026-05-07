'use client';

import { JobListings } from '@/components/jobs/JobListings';

export default function PublicJobsPage() {
  return <JobListings basePath="/lowongan" />;
}