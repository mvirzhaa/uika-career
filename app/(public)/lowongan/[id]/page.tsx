'use client';

import { use } from 'react';
import { JobDetail } from '@/components/jobs/JobDetail';

export default function PublicJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  return <JobDetail id={resolvedParams.id} basePath="/lowongan" />;
}
