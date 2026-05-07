'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api/admin';
import { Job } from '@/types';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getJobs({ page, limit, search, status });
      setJobs(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus lowongan ini? Semua lamaran ke lowongan ini akan terhapus.')) return;
    try {
      await adminApi.deleteJob(id);
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Gagal menghapus lowongan');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Manajemen Lowongan</h1>
          <p className="text-neutral-500 mt-2">Kelola semua daftar lowongan pekerjaan yang ditayangkan di sistem.</p>
        </div>
        <Link 
          href="/admin/jobs/new" 
          className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 font-bold px-6 py-3 rounded-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <span className="text-xl leading-none">+</span> Tambah Lowongan
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200 flex flex-col sm:flex-row gap-4 items-end">
        <form onSubmit={handleSearch} className="flex-1 w-full">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 block">Cari Lowongan</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="input flex-1" 
              placeholder="Posisi atau nama perusahaan..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" variant="secondary">Cari</Button>
          </div>
        </form>

        <div className="w-full sm:w-48">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 block">Filter Status</label>
          <select 
            className="input"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Status</option>
            <option value="open">Open</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-xs uppercase font-bold text-neutral-500">
                <th className="px-6 py-4">Posisi / Perusahaan</th>
                <th className="px-6 py-4">Tipe Kerja</th>
                <th className="px-6 py-4">Batas Lamaran</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500">
                    Tidak ada lowongan yang ditemukan.
                  </td>
                </tr>
              ) : (
                jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                       <div className="font-bold text-neutral-900">{j.title}</div>
                       <div className="text-sm text-neutral-500 flex items-center gap-1">
                          🏢 {j.company?.name || '-'}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="badge-neutral">
                        {j.employmentType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {j.deadlineAt ? new Date(j.deadlineAt).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge text-xs px-2 py-1 ${
                        j.status === 'open' ? 'badge-primary' : 
                        j.status === 'draft' ? 'badge-neutral' : 'badge-error'
                      }`}>
                        {j.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <a 
                        href={`/lowongan/${j.id}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary-600 hover:text-primary-800 font-bold text-sm bg-primary-50 px-3 py-1.5 rounded-lg inline-block"
                      >
                        Lihat
                      </a>
                      <button 
                        onClick={() => handleDelete(j.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg inline-block"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        {!isLoading && jobs.length > 0 && (
          <div className="p-4 border-t border-neutral-200 flex items-center justify-between bg-neutral-50">
            <span className="text-sm text-neutral-500">
              Menampilkan {(page - 1) * limit + 1} - {Math.min(page * limit, total)} dari {total} data
            </span>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                ← Prev
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
