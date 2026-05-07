'use client';

import { useState } from 'react';
import { adminApi } from '@/lib/api/admin';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminCreateCompanyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    city: '',
    website: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await adminApi.createCompany(formData);
      alert('Perusahaan berhasil ditambahkan!');
      router.push('/admin/companies');
    } catch (error) {
      console.error(error);
      alert('Gagal menambahkan perusahaan. Pastikan data terisi dengan benar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/companies" className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-primary-600 hover:border-primary-200 shadow-sm transition-all hover:-translate-x-1">
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Tambah Perusahaan</h1>
          <p className="text-neutral-500 mt-1">Daftarkan perusahaan mitra baru secara manual ke dalam sistem.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Nama Perusahaan <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                className="input w-full bg-neutral-50 focus:bg-white"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: PT Teknologi Nusantara"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Industri</label>
                <input 
                  type="text" 
                  className="input w-full bg-neutral-50 focus:bg-white"
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="Contoh: IT, Manufaktur..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Kota / Lokasi Dasar</label>
                <input 
                  type="text" 
                  className="input w-full bg-neutral-50 focus:bg-white"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Contoh: Jakarta Selatan"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Website Resmi</label>
              <input 
                type="url" 
                className="input w-full bg-neutral-50 focus:bg-white"
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Deskripsi Perusahaan</label>
              <textarea 
                className="input w-full min-h-[120px] bg-neutral-50 focus:bg-white resize-y"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tuliskan profil singkat perusahaan di sini..."
              ></textarea>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-neutral-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Link 
              href="/admin/companies" 
              className="px-6 py-3 text-neutral-600 font-bold hover:bg-neutral-100 rounded-xl text-center transition-colors"
            >
              Batal
            </Link>
            <Button type="submit" disabled={isSubmitting} className="px-8 shadow-lg shadow-primary-500/30">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perusahaan Baru'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
