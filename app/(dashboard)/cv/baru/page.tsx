'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCVs } from '@/hooks/useCVs';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function CVBuilderPage() {
  const router = useRouter();
  const { createCV } = useCVs();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [templateType, setTemplateType] = useState<'MODERN' | 'CLASSIC' | 'CREATIVE'>('MODERN');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMsg('Judul CV tidak boleh kosong');
      return;
    }
    
    setIsSaving(true);
    setErrorMsg(null);
    try {
      // In MVP, we only create the CV shell. Further sections logic will be done in the edit page.
      const newCv = await createCV({
        title: title.trim(),
        templateType,
      });
      // Redirect back to CV list
      router.push('/cv');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan CV');
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* Builder Navbar */}
      <nav className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/cv" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            ←
          </Link>
          <div>
            <h1 className="font-bold text-neutral-900 leading-none">Draft CV Baru</h1>
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Belum disimpan</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" className="px-6" onClick={handleSave} isLoading={isSaving}>Simpan & Buat CV</Button>
        </div>
      </nav>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Editor Form (Scrollable) */}
        <aside className="w-full lg:w-[550px] bg-white border-r border-neutral-200 overflow-y-auto p-8 custom-scrollbar">
          
          <div className="space-y-8 animate-fade-in">
            <header>
              <h2 className="text-2xl font-bold text-neutral-900">Setup Awal CV</h2>
              <p className="text-neutral-500 text-sm mt-1">Berikan nama untuk CV Anda dan pilih template dasar.</p>
            </header>

            {errorMsg && (
              <div className="p-3 rounded bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="label mb-2">Judul CV (Hanya untuk Anda)</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Contoh: CV Frontend Dev - Gojek" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="label mb-3">Pilih Template</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'MODERN', name: 'Modern' },
                    { id: 'CLASSIC', name: 'Klasik (Formal)' },
                    { id: 'CREATIVE', name: 'Kreatif' },
                  ].map((tpl) => (
                    <label key={tpl.id} className={`cursor-pointer border rounded-xl p-4 transition-all ${templateType === tpl.id ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-100 ring-offset-1' : 'border-neutral-200 hover:border-primary-300'}`}>
                      <input 
                        type="radio" 
                        name="template" 
                        value={tpl.id} 
                        checked={templateType === tpl.id}
                        onChange={() => setTemplateType(tpl.id as any)}
                        className="hidden" 
                      />
                      <div className="font-bold text-neutral-900 text-sm text-center">{tpl.name}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button variant="primary" className="w-full py-3" onClick={handleSave} isLoading={isSaving}>
                  Mulai Buat CV →
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Live Preview (Hidden on mobile) */}
        <main className="hidden lg:flex flex-1 bg-neutral-100 items-start justify-center p-12 overflow-y-auto">
          <div className="w-[595px] min-h-[842px] bg-white shadow-2xl rounded-sm p-12 origin-top scale-95 sticky top-0 opacity-50 blur-[2px] transition-all hover:blur-none hover:opacity-100">
            {/* CV Template Preview Area */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
               <div className="bg-neutral-900/80 text-white px-4 py-2 rounded-lg font-bold">Pratinjau Template {templateType}</div>
            </div>
            <header className={`border-b-2 ${templateType === 'CLASSIC' ? 'border-neutral-900' : 'border-primary-600'} pb-6 mb-8 flex justify-between items-end`}>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{user?.name ? user.name.toUpperCase() : 'NAMA LENGKAP'}</h1>
                <p className="text-primary-600 font-semibold tracking-wide uppercase text-sm mt-1">{title || 'POSISI / HEADLINE'}</p>
              </div>
              <div className="text-right text-[10px] text-neutral-500 space-y-0.5">
                <p>{user?.profile?.city || 'Kota'}, {user?.profile?.province || 'Provinsi'}</p>
                <p>{user?.email || 'email@contoh.com'}</p>
              </div>
            </header>

            <div className="space-y-8">
               <div className="h-20 bg-neutral-100 rounded"></div>
               <div className="h-40 bg-neutral-100 rounded"></div>
               <div className="h-32 bg-neutral-100 rounded"></div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
