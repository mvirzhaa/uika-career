'use client';

import Link from 'next/link';
import { useCVs } from '@/hooks/useCVs';
import { useEffect } from 'react';

export default function CVListPage() {
  const { cvs, isLoading, error, fetchCVs, setPrimaryCV, deleteCV } = useCVs();

  useEffect(() => {
    fetchCVs();
  }, [fetchCVs]);

  const handleSetPrimary = async (id: string) => {
    if (confirm('Jadikan CV ini sebagai yang utama?')) {
      await setPrimaryCV(id);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus CV ini secara permanen?')) {
      await deleteCV(id);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto py-4 sm:py-8">
        
        <div className="page-header">
          <div>
            <h1 className="page-title text-3xl">Curriculum Vitae</h1>
            <p className="page-subtitle text-lg">Buat dan kelola berbagai versi CV profesional Anda.</p>
          </div>
          <Link href="/cv/baru" className="btn-primary">
            <span className="text-lg">+</span> Buat CV Baru
          </Link>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {isLoading && cvs.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="skeleton h-64 w-full rounded-3xl"></div>
            <div className="skeleton h-64 w-full rounded-3xl"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            
            {/* Create New Card (Dotted) */}
            <Link href="/cv/baru" className="h-64 rounded-3xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-3 hover:border-primary-400 hover:bg-primary-50 transition-all group">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                <span className="text-2xl">+</span>
              </div>
              <span className="font-bold text-neutral-500 group-hover:text-primary-700">Gunakan Template Baru</span>
            </Link>

            {/* CV Card List */}
            {cvs.map((cv) => (
              <div key={cv.id} className={`card h-64 overflow-hidden group ${cv.isPrimary ? 'border-primary-300 shadow-md ring-1 ring-primary-100' : ''}`}>
                <div className="h-40 bg-neutral-100 relative overflow-hidden flex items-center justify-center">
                   {/* Mini Preview Placeholder */}
                   <div className="w-24 h-32 bg-white shadow-lg rounded p-2 scale-100 group-hover:scale-110 transition-transform duration-500">
                      <div className="w-8 h-1 bg-neutral-200 mb-1"></div>
                      <div className="w-12 h-1 bg-neutral-100 mb-2"></div>
                      <div className="space-y-1">
                        <div className="w-full h-[2px] bg-neutral-50"></div>
                        <div className="w-full h-[2px] bg-neutral-50"></div>
                        <div className="w-2/3 h-[2px] bg-neutral-50"></div>
                      </div>
                   </div>
                   {cv.isPrimary && (
                     <div className="absolute top-3 left-3">
                       <span className="badge-primary shadow-sm">Utama</span>
                     </div>
                   )}
                   <div className="absolute inset-0 bg-primary-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Link href={`/cv/${cv.id}`} className="p-2 bg-white rounded-lg text-primary-700 hover:bg-accent-400 hover:text-white transition-colors" title="Edit">✏️</Link>
                      {/* <button className="p-2 bg-white rounded-lg text-primary-700 hover:bg-accent-400 hover:text-white transition-colors" title="Preview">👁️</button> */}
                      <button onClick={() => handleDelete(cv.id)} className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-500 hover:text-white transition-colors" title="Hapus">🗑️</button>
                   </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-neutral-900 truncate" title={cv.title}>{cv.title}</h3>
                    {!cv.isPrimary && (
                      <button 
                        onClick={() => handleSetPrimary(cv.id)}
                        className="text-[10px] uppercase font-bold text-neutral-400 hover:text-primary-600 bg-neutral-100 hover:bg-primary-50 px-2 py-1 rounded transition-colors"
                        title="Set Utama"
                      >
                        Set Utama
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-neutral-400">Update: {new Date(cv.updatedAt).toLocaleDateString('id-ID')}</span>
                    <div className="flex gap-1 items-center">
                      <span className={`w-1.5 h-1.5 rounded-full ${cv.isPublic ? 'bg-green-500' : 'bg-neutral-300'}`} title={cv.isPublic ? 'Publik' : 'Privat'}></span>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">{cv.isPublic ? 'Publik' : 'Privat'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 p-6 rounded-2xl bg-accent-50 border border-accent-100 flex gap-4 items-center">
           <div className="text-2xl">💡</div>
           <p className="text-sm text-accent-800">
             <span className="font-bold">Tips:</span> Anda dapat membuat banyak versi CV yang disesuaikan untuk posisi pekerjaan yang berbeda untuk meningkatkan peluang diterima.
           </p>
        </div>

      </div>
    </div>
  );
}
