'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { jobsApi } from '@/lib/api/jobs';
import { Job, JobFilters } from '@/types';

interface JobListingsProps {
  basePath?: string;
}

export const JobListings = ({ basePath = '/lowongan' }: JobListingsProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
  });

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await jobsApi.getAll(filters);
      setJobs(res.data || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  return (
    <div className="p-4 sm:p-8">
      <main className="flex-1 pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="card p-5 sm:p-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between lg:block mb-4">
                <h3 className="font-heading font-bold text-lg text-neutral-900">Filter</h3>
                <button 
                  onClick={() => setFilters({search: ''})}
                  className="lg:hidden text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg"
                >
                  Reset
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                <div>
                  <label className="label text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Pencarian</label>
                  <input 
                    type="text" 
                    className="input mt-1" 
                    placeholder="Posisi / perusahaan..." 
                    value={filters.search}
                    onChange={handleSearchChange}
                  />
                </div>

                <div>
                  <label className="label text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Tipe Kerja</label>
                  <div className="flex flex-wrap lg:flex-col gap-2 lg:gap-2 mt-2">
                    {['FULL_TIME', 'PART_TIME', 'INTERNSHIP'].map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer group bg-neutral-50 lg:bg-transparent px-3 py-1.5 lg:p-0 rounded-xl border border-neutral-100 lg:border-none">
                        <input type="checkbox" className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                        <span className="text-xs sm:text-sm text-neutral-600 group-hover:text-primary-700">{t.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setFilters({search: ''})}
                className="hidden lg:block btn-secondary w-full mt-8 btn-sm"
              >
                Reset Filter
              </button>
            </div>
          </aside>

          {/* Job Listings */}
          <section className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-neutral-900">
                {isLoading ? 'Mencari...' : `Ditemukan ${jobs.length} Lowongan`}
              </h1>
              <div className="flex gap-2">
                 <span className="text-sm text-neutral-500">Urutkan:</span>
                 <select className="bg-transparent text-sm font-semibold text-primary-700 outline-none">
                   <option>Terbaru</option>
                   <option>Gaji Tertinggi</option>
                 </select>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton h-32 w-full rounded-2xl"></div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-12 text-center card bg-neutral-50 border-dashed">
                 <div className="text-4xl mb-4">🔍</div>
                 <h3 className="text-neutral-900 font-bold">Tidak ada lowongan ditemukan</h3>
                 <p className="text-neutral-500 mt-2 text-sm">Coba ubah filter atau kata kunci pencarian Anda.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="card-hover p-6 flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-3xl border border-neutral-200 overflow-hidden shrink-0">
                    {job.company?.logoUrl ? (
                      <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : '🏢'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="badge-primary">{job.jobType.replace('_', ' ')}</span>
                      <span className="badge-accent">{job.workLocation}</span>
                    </div>
                    <Link href={`${basePath}/${job.id}`}>
                      <h2 className="text-xl font-bold text-neutral-900 mb-1 hover:text-primary-600 transition-colors truncate">
                        {job.title}
                      </h2>
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500 mt-2">
                      <span className="flex items-center gap-1">📍 {job.city || job.company?.city || 'Lokasi tidak disebutkan'}</span>
                      <span className="flex items-center gap-1 font-semibold text-neutral-700">🏢 {job.company?.name || 'Perusahaan'}</span>
                      {(job.salaryMin || job.salaryMax) && (
                        <span className="flex items-center gap-1 font-medium text-primary-600">
                          💰 {job.currency} {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex items-center gap-3 shrink-0 mt-4 md:mt-0">
                     <Link href={`${basePath}/${job.id}`} className="btn-secondary flex-1 md:flex-none">Detail</Link>
                     <Link href={`${basePath}/${job.id}?apply=true`} className="btn-primary flex-1 md:flex-none">Lamar Cepat</Link>
                  </div>
                </div>
              ))
            )}

            {/* Pagination Placeholder */}
            {!isLoading && jobs.length > 0 && (
              <div className="flex justify-center mt-12 gap-2">
                <button className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold shadow-sm">1</button>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};
