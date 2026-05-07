'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api/admin';
import { User } from '@/types';
import { Button } from '@/components/ui/Button';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getUsers({ page, limit, search, role });
      setUsers(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role]);

  // Handle search via button click or enter
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchUsers();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Manajemen Pengguna</h1>
        <p className="text-neutral-500 mt-1">Kelola seluruh akun mahasiswa, alumni, dan administrator terdaftar.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 flex flex-col sm:flex-row gap-5 items-end">
        <form onSubmit={handleSearch} className="flex-1 w-full">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 block">Cari Pengguna</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="input flex-1 bg-neutral-50 focus:bg-white" 
              placeholder="Ketik email atau nama lengkap pengguna..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" variant="secondary">Cari</Button>
          </div>
        </form>
        
        <div className="w-full sm:w-48">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 block">Filter Role</label>
          <select 
            className="input w-full bg-neutral-50 focus:bg-white"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Role</option>
            <option value="STUDENT">Mahasiswa</option>
            <option value="ALUMNI">Alumni</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-xs uppercase font-bold text-neutral-500">
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tgl Daftar</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">
                    Tidak ada pengguna yang ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-neutral-900">{u.profile?.fullName || u.name || '-'}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">ID: {u.id.substring(0,8)}...</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`badge text-xs px-2.5 py-1 ${
                        u.role === 'ADMIN' ? 'bg-red-50 text-red-600 border border-red-100' : 
                        u.role === 'ALUMNI' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                        'bg-primary-50 text-primary-600 border border-primary-100'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${u.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {u.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary-600 hover:text-white font-bold text-sm bg-primary-50 hover:bg-primary-600 px-4 py-2 rounded-xl transition-all duration-300">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        {!isLoading && users.length > 0 && (
          <div className="p-4 border-t border-neutral-200 flex items-center justify-between bg-neutral-50">
            <span className="text-sm text-neutral-500">
              Menampilkan {(page - 1) * limit + 1} - {Math.min(page * limit, total)} dari {total} pengguna
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
