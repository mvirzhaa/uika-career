'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { jobsApi } from '@/lib/api/jobs';
import { applicationsApi } from '@/lib/api/applications';
import { Job } from '@/types';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

interface JobDetailProps {
  id: string;
  basePath?: string;
}

export const JobDetail = ({ id, basePath = '/lowongan' }: JobDetailProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const data = await jobsApi.getById(id);
        setJob(data);
      } catch (err) {
        console.error(err);
        setErrorMsg('Lowongan tidak ditemukan atau terjadi kesalahan server.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${basePath}/${id}`);
      return;
    }

    if (!job) return;
    setIsApplying(true);
    setErrorMsg(null);
    try {
      await applicationsApi.apply({ jobId: job.id });
      setApplySuccess(true);
      setTimeout(() => {
        router.push('/lamaran-kerja');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal melamar. Pastikan CV utama telah diatur.');
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div className="skeleton h-32 w-full rounded-2xl"></div>
        <div className="skeleton h-64 w-full rounded-2xl"></div>
      </div>
    );
  }

  if (errorMsg && !job) {
    return (
      <div className="p-12 text-center">
        <div className="text-4xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">{errorMsg}</h2>
        <Link href={basePath} className="text-primary-600 hover:underline font-medium">← Kembali ke daftar lowongan</Link>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        <Link href={basePath} className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 mb-6 transition-colors">
          <span>←</span> Kembali
        </Link>

        {/* Header Section */}
        <div className="card p-6 sm:p-8 mb-8 relative overflow-hidden border-t-4 border-t-primary-600">
           <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-4xl shrink-0 overflow-hidden bg-white shadow-sm">
                 {job.company?.logoUrl ? <img src={job.company.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : '🏢'}
              </div>
              <div className="flex-1">
                 <div className="flex flex-wrap gap-2 mb-3">
                   <span className="badge-primary">{job.jobType.replace('_', ' ')}</span>
                   <span className="badge-accent">{job.workLocation}</span>
                   <span className="badge-neutral">{job.experienceLevel}</span>
                 </div>
                 <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">{job.title}</h1>
                 <div className="text-neutral-600 font-bold mb-4">{job.company?.name}</div>
                 
                 <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">📍 {job.city || job.company?.city || 'Tidak ditentukan'}</div>
                    {(job.salaryMin || job.salaryMax) && (
                      <div className="flex items-center gap-2 font-medium text-primary-600">
                        💰 {job.currency} {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
                      </div>
                    )}
                 </div>
              </div>
              <div className="w-full sm:w-auto flex flex-col gap-3">
                 <Button variant="primary" className="w-full sm:w-48 shadow-lg shadow-primary-500/30" onClick={handleApply} isLoading={isApplying} disabled={applySuccess}>
                   {applySuccess ? 'Berhasil Dilamar!' : (isAuthenticated ? 'Lamar Sekarang' : 'Masuk untuk Melamar')}
                 </Button>
              </div>
           </div>

           {errorMsg && (
             <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
               ⚠️ {errorMsg}
             </div>
           )}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
           <div className="md:col-span-2 space-y-8">
              <div className="card p-6 sm:p-8">
                <h3 className="font-bold text-primary-900 text-lg mb-4 flex items-center gap-2"><span className="text-xl">📋</span> Deskripsi Pekerjaan</h3>
                <div className="prose prose-sm prose-neutral max-w-none whitespace-pre-wrap text-neutral-600 leading-relaxed">
                  {job.description || 'Tidak ada deskripsi rinci.'}
                </div>

                <div className="h-px bg-neutral-100 my-8"></div>

                <h3 className="font-bold text-primary-900 text-lg mb-4 flex items-center gap-2"><span className="text-xl">🎯</span> Persyaratan</h3>
                <div className="prose prose-sm prose-neutral max-w-none whitespace-pre-wrap text-neutral-600 leading-relaxed">
                  {job.requirements || 'Tidak ada persyaratan spesifik yang ditulis.'}
                </div>
              </div>
           </div>

           <div className="md:col-span-1 space-y-6">
              <div className="card p-6 border-t-4 border-t-accent-500">
                 <h3 className="font-bold text-neutral-900 mb-4">Tentang Perusahaan</h3>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
                       {job.company?.logoUrl ? <img src={job.company.logoUrl} alt="Logo" /> : '🏢'}
                    </div>
                    <div className="font-bold text-neutral-900 leading-tight">{job.company?.name}</div>
                 </div>
                 <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                   {job.company?.description || 'Perusahaan mitra UIKA Career Portal.'}
                 </p>
                 {job.company?.website && (
                   <a href={job.company.website} target="_blank" rel="noreferrer" className="text-primary-600 text-sm font-bold hover:underline">
                     Kunjungi Website ↗
                   </a>
                 )}
              </div>

              <div className="card p-6 bg-neutral-50 border-dashed border-2">
                 <div className="text-sm text-neutral-500 mb-2 font-medium">Ditayangkan pada</div>
                 <div className="font-bold text-neutral-900">{new Date(job.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                 
                 {job.closingDate && (
                   <>
                     <div className="text-sm text-neutral-500 mt-4 mb-2 font-medium">Batas Akhir Lamaran</div>
                     <div className="font-bold text-red-600">{new Date(job.closingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                   </>
                 )}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};
