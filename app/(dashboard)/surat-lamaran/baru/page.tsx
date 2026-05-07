'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { coverLettersApi } from '@/lib/api/cover-letters';
import { Button } from '@/components/ui/Button';

export default function NewCoverLetterPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Judul dan Isi surat tidak boleh kosong.');
      return;
    }
    
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await coverLettersApi.create({
        title,
        content,
        language: 'id',
        status: 'draft',
      });
      router.push('/surat-lamaran');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan surat lamaran.');
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto py-4 sm:py-8">
        
        <div className="mb-6 flex items-center gap-4">
          <Link href="/surat-lamaran" className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Tulis Surat Lamaran Baru</h1>
        </div>

        {errorMsg && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="card p-6 sm:p-8">
          <div className="space-y-6">
            
            <div>
              <label className="label mb-2">Judul Surat (Hanya untuk Anda)</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Contoh: Surat Lamaran Frontend Developer" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="label mb-2">Isi Surat</label>
              <textarea 
                className="input min-h-[400px] py-4 leading-relaxed" 
                placeholder="Yth. Bapak/Ibu HRD..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              <p className="text-xs text-neutral-500 mt-2">Gunakan format yang profesional dan sopan. Anda dapat menyalin dari template yang ada.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <Link href="/surat-lamaran" className="btn-secondary">Batal</Link>
              <Button type="button" variant="primary" onClick={handleSave} isLoading={isSaving}>Simpan Surat</Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
