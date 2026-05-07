'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api/admin';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminCreateJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    description: '',
    location: '',
    workType: 'onsite',
    employmentType: 'fulltime',
    status: 'open',
    salaryCurrency: 'IDR',
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await adminApi.getCompanies({ limit: 100 });
        setCompanies(res.data);
      } catch (error) {
        console.error('Failed to load companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyId) {
      alert('Pilih perusahaan terlebih dahulu!');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await adminApi.createJob(formData);
      alert('Lowongan berhasil diterbitkan!');
      router.push('/admin/jobs');
    } catch (error) {
      console.error(error);
      alert('Gagal menambahkan lowongan. Pastikan data terisi dengan benar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/jobs" className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-primary-600 hover:border-primary-200 shadow-sm transition-all hover:-translate-x-1">
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Tambah Lowongan Baru</h1>
          <p className="text-neutral-500 mt-1">Daftarkan dan tayangkan lowongan pekerjaan ke dalam sistem UIKA.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8 space-y-8">
            {/* Section 1: Info Utama */}
            <div>
              <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2 mb-4">Informasi Dasar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Posisi Pekerjaan / Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    className="input w-full bg-neutral-50 focus:bg-white text-lg font-medium"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Senior Frontend Developer"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Perusahaan <span className="text-red-500">*</span></label>
                  <select 
                    required
                    className="input w-full bg-neutral-50 focus:bg-white"
                    value={formData.companyId}
                    onChange={e => setFormData({ ...formData, companyId: e.target.value })}
                  >
                    <option value="" disabled>-- Pilih Perusahaan --</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {companies.length === 0 && <p className="text-xs text-red-500 mt-1">Sedang memuat daftar perusahaan... (Atau tambahkan perusahaan baru terlebih dahulu)</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Lokasi Penempatan</label>
                  <input 
                    type="text" 
                    className="input w-full bg-neutral-50 focus:bg-white"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Contoh: Bogor, Jawa Barat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Sistem Kerja</label>
                  <select 
                    className="input w-full bg-neutral-50 focus:bg-white"
                    value={formData.workType}
                    onChange={e => setFormData({ ...formData, workType: e.target.value })}
                  >
                    <option value="onsite">Work From Office (On-site)</option>
                    <option value="remote">Work From Home (Remote)</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Tipe Kontrak</label>
                  <select 
                    className="input w-full bg-neutral-50 focus:bg-white"
                    value={formData.employmentType}
                    onChange={e => setFormData({ ...formData, employmentType: e.target.value })}
                  >
                    <option value="fulltime">Full-Time</option>
                    <option value="parttime">Part-Time</option>
                    <option value="internship">Magang / Internship</option>
                    <option value="freelance">Freelance</option>
                    <option value="contract">Kontrak</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Status Penayangan</label>
                  <select 
                    className="input w-full bg-neutral-50 focus:bg-white"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="open">Langsung Tayang (Open)</option>
                    <option value="draft">Simpan sebagai Draft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Deskripsi Pekerjaan */}
            <div>
              <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2 mb-4">Deskripsi Pekerjaan</h2>
              <div>
                <textarea 
                  required
                  className="input w-full min-h-[250px] bg-neutral-50 focus:bg-white resize-y leading-relaxed"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsikan tanggung jawab, kualifikasi, dan hal lain yang relevan di sini..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Form Footer Actions */}
          <div className="p-6 sm:p-8 bg-neutral-50 border-t border-neutral-200 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Link 
              href="/admin/jobs" 
              className="px-6 py-3 text-neutral-600 font-bold hover:bg-neutral-200 rounded-xl text-center transition-colors"
            >
              Batal
            </Link>
            <Button type="submit" disabled={isSubmitting} className="px-8 shadow-lg shadow-primary-500/30">
              {isSubmitting ? 'Menyimpan...' : (formData.status === 'open' ? 'Tayangkan Lowongan' : 'Simpan Draft')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
