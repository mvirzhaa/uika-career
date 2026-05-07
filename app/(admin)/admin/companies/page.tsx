'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api/admin';
import { Company } from '@/types';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getCompanies({ page, limit, search });
      setCompanies(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(1);
    fetchCompanies();
  };

  const toggleVerify = async (id: string, currentStatus: boolean) => {
    try {
      await adminApi.verifyCompany(id, !currentStatus);
      fetchCompanies(); // Refresh data
    } catch (error) {
      console.error('Failed to toggle verification:', error);
      alert('Gagal mengubah status verifikasi');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus perusahaan ini? Semua lowongan dan pelamar terkait mungkin akan terhapus.')) return;
    try {
      await adminApi.deleteCompany(id);
      fetchCompanies();
    } catch (error) {
      console.error('Failed to delete company:', error);
      alert('Gagal menghapus perusahaan');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Manajemen Perusahaan</h1>
          <p className="text-neutral-500 mt-2">Kelola dan verifikasi akun perusahaan mitra UIKA.</p>
        </div>
        <Link 
          href="/admin/companies/new" 
          className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 font-bold px-6 py-3 rounded-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <span className="text-xl leading-none">+</span> Tambah Perusahaan
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200 flex flex-col sm:flex-row gap-4 items-end">
        <form onSubmit={handleSearch} className="flex-1 w-full">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 block">Cari Perusahaan</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="input flex-1" 
              placeholder="Ketik nama perusahaan..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" variant="secondary">Cari</Button>
          </div>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-xs uppercase font-bold text-neutral-500">
                <th className="px-6 py-4">Perusahaan</th>
                <th className="px-6 py-4">Industri</th>
                <th className="px-6 py-4">Lokasi</th>
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
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500">
                    Tidak ada perusahaan yang ditemukan.
                  </td>
                </tr>
              ) : (
                companies.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center border border-neutral-200 overflow-hidden shrink-0">
                          {c.logoUrl ? <img src={c.logoUrl} alt={c.name} className="w-full h-full object-cover" /> : '🏢'}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900">{c.name}</div>
                          {c.website && <a href={c.website} target="_blank" rel="noreferrer" className="text-xs text-primary-600 hover:underline">{c.website}</a>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{c.industry || '-'}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{c.city || '-'}</td>
                    <td className="px-6 py-4">
                      {c.isVerified ? (
                        <span className="badge-primary px-2 py-1 text-xs">✓ Terverifikasi</span>
                      ) : (
                        <span className="badge-neutral px-2 py-1 text-xs">⏳ Menunggu</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => toggleVerify(c.id, c.isVerified)}
                        className={`font-bold text-sm px-3 py-1.5 rounded-lg transition-colors ${
                          c.isVerified ? 'text-neutral-500 hover:bg-neutral-100' : 'text-green-600 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        {c.isVerified ? 'Batal Verifikasi' : 'Verifikasi'}
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg"
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
        {!isLoading && companies.length > 0 && (
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
