"use client";

import React from 'react';
import { useJobs } from '@/hooks/useJobs';
import { JobCard } from '@/components/features/job/JobCard';

export default function JobBoardClient() {
  const { data: jobs, isLoading, isError, error } = useJobs();

  // Handler untuk tombol aksi
  const handleApply = (id: string) => console.log('Lamar job:', id);
  const handleBookmark = (id: string) => console.log('Bookmark job:', id);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
      {/* Sidebar Filters */}
      <aside className="lg:col-span-1 space-y-6">
        <div className="card p-5 sm:p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between lg:block mb-4">
            <h3 className="font-heading font-bold text-lg text-neutral-900">Filter</h3>
            <button className="lg:hidden text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">Reset</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <div>
              <label className="label text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Pencarian</label>
              <input type="text" className="input mt-1" placeholder="Judul pekerjaan..." />
            </div>

            <div>
              <label className="label text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Tipe Kerja</label>
              <div className="flex flex-wrap lg:flex-col gap-2 lg:gap-2 mt-2">
                {['Full-time', 'Internship', 'Freelance'].map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer group bg-neutral-50 lg:bg-transparent px-3 py-1.5 lg:p-0 rounded-xl border border-neutral-100 lg:border-none">
                    <input type="checkbox" className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-xs sm:text-sm text-neutral-600 group-hover:text-primary-700">{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button className="hidden lg:block btn-secondary w-full mt-8 btn-sm">Reset Filter</button>
        </div>
      </aside>

      {/* Job Listings */}
      <section className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-neutral-900">
            {isLoading ? 'Mencari lowongan...' : `Ditemukan ${jobs?.length || 0} Lowongan`}
          </h1>
          <div className="flex gap-2">
            <span className="text-sm text-neutral-500">Urutkan:</span>
            <select className="bg-transparent text-sm font-semibold text-primary-700 outline-none">
              <option>Terbaru</option>
              <option>Gaji Tertinggi</option>
            </select>
          </div>
        </div>

        {/* State Handling */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
          </div>
        )}

        {isError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
            {error?.message || 'Terjadi kesalahan saat mengambil data.'}
          </div>
        )}

        {/* Render Real Data using JobCard */}
        {!isLoading && !isError && jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onApply={handleApply}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
        ) : (
          !isLoading && !isError && (
            <div className="text-center py-20 text-neutral-500">
              Belum ada lowongan yang tersedia saat ini.
            </div>
          )
        )}

        {/* Pagination Placeholder */}
        {!isLoading && !isError && jobs && jobs.length > 0 && (
          <div className="flex justify-center mt-12 gap-2">
            <button className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-bold text-primary-600">1</button>
            <button className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-primary-300">2</button>
          </div>
        )}
      </section>
    </div>
  );
}