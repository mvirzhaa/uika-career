'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { coverLettersApi } from '@/lib/api/cover-letters';
import { CoverLetter } from '@/types';

export default function CoverLettersPage() {
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLetters = async () => {
    try {
      setIsLoading(true);
      const data = await coverLettersApi.getAll();
      setLetters(data);
    } catch (error) {
      console.error('Failed to fetch cover letters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Hapus surat lamaran ini?')) {
      try {
        await coverLettersApi.delete(id);
        fetchLetters();
      } catch (error) {
        alert('Gagal menghapus surat lamaran.');
      }
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto py-4 sm:py-8">
        
        <div className="page-header">
          <div>
            <h1 className="page-title text-3xl">Surat Lamaran</h1>
            <p className="page-subtitle text-lg">Kelola surat lamaran kerja (Cover Letter) Anda.</p>
          </div>
          <Link href="/surat-lamaran/baru" className="btn-primary">
            <span className="text-lg">+</span> Buat Surat Baru
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="skeleton h-64 rounded-3xl w-full"></div>
            <div className="skeleton h-64 rounded-3xl w-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            
            {/* Create New Card */}
            <Link href="/surat-lamaran/baru" className="h-64 rounded-3xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-3 hover:border-primary-400 hover:bg-primary-50 transition-all group">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                <span className="text-2xl">+</span>
              </div>
              <span className="font-bold text-neutral-500 group-hover:text-primary-700">Tulis Surat Baru</span>
            </Link>

            {/* Cover Letter Examples */}
            {letters.map((letter) => (
              <div key={letter.id} className="card h-64 overflow-hidden group flex flex-col">
                <div className="p-6 flex-1 border-b border-neutral-100 flex flex-col items-center justify-center bg-neutral-50 group-hover:bg-primary-50/50 transition-colors">
                  <div className="text-4xl mb-3">✉️</div>
                  <h3 className="font-bold text-neutral-900 text-center">{letter.title}</h3>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mt-2">{letter.status}</div>
                </div>
                <div className="p-4 bg-white flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Update: {new Date(letter.updatedAt).toLocaleDateString('id-ID')}</span>
                  <div className="flex gap-2">
                    {/* <button className="text-primary-600 hover:text-primary-700 font-bold text-sm">Edit</button> */}
                    <button onClick={() => handleDelete(letter.id)} className="text-red-500 hover:text-red-600 font-bold text-sm">Hapus</button>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}
