'use client';

import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { usersApi } from '@/lib/api/users';
import { useState, useEffect } from 'react';

const profileSchema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio maksimal 500 karakter").optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  address: z.string().optional(),
  
  nim: z.string().optional(),
  faculty: z.string().optional(),
  major: z.string().optional(),
  graduationYear: z.preprocess((val) => (val ? Number(val) : undefined), z.number().min(1950).optional()),

  linkedinUrl: z.string().url("Format URL tidak valid").optional().or(z.literal('')),
  githubUrl: z.string().url("Format URL tidak valid").optional().or(z.literal('')),
  portfolioUrl: z.string().url("Format URL tidak valid").optional().or(z.literal('')),
});

type ProfileFormInput = z.input<typeof profileSchema>;
type ProfileFormValues = z.output<typeof profileSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormInput, any, ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.name || '',
        phone: user.profile?.phone || '',
        bio: user.profile?.bio || '',
        city: user.profile?.city || '',
        province: user.profile?.province || '',
        address: user.profile?.address || '',
        
        nim: user.profile?.nim || '',
        faculty: user.profile?.faculty || '',
        major: user.profile?.major || '',
        graduationYear: user.profile?.graduationYear || undefined,
        
        linkedinUrl: user.profile?.linkedinUrl || '',
        githubUrl: user.profile?.githubUrl || '',
        portfolioUrl: user.profile?.portfolioUrl || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);
    
    try {
      const updatedUser = await usersApi.updateProfile({
        ...data,
      });
      setUser(updatedUser); // Update local store
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal menyimpan profil.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div className="p-8 flex justify-center"><span className="animate-spin text-primary-500 text-3xl">⚙️</span></div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-5xl mx-auto py-4 sm:py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Pengaturan Profil Lengkap</h1>
          <p className="text-neutral-500 mt-1">Lengkapi data diri Anda agar perusahaan lebih mudah mengenali potensi Anda.</p>
        </div>

        {saveSuccess && (
          <div className="mb-8 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-3 animate-slide-up shadow-sm">
            <span className="text-2xl">✅</span>
            <div>
              <strong className="block">Profil Berhasil Disimpan!</strong>
              <span className="text-sm">Data Anda telah diperbarui dalam sistem UIKA Career.</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 animate-slide-up shadow-sm">
            <span className="text-2xl">⚠️</span>
            <div>
              <strong className="block">Gagal Menyimpan</strong>
              <span className="text-sm">{errorMsg}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section: Basic Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-100">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-neutral-100">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">1</div>
              <h2 className="text-xl font-bold text-neutral-900">Informasi Pribadi Dasar</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nama Lengkap Sesuai KTP" error={errors.fullName?.message} {...register('fullName')} />
              <Input label="Nomor Telepon / WhatsApp" error={errors.phone?.message} {...register('phone')} />
              
              <div className="md:col-span-2">
                <label className="label mb-2">Biografi Singkat (Tentang Saya)</label>
                <textarea 
                  className={`input min-h-[120px] resize-y ${errors.bio ? 'border-red-500' : ''}`}
                  placeholder="Ceritakan tentang diri Anda, keahlian, dan tujuan karir..."
                  {...register('bio')}
                ></textarea>
                {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>}
              </div>

              <div className="md:col-span-2">
                <Input label="Alamat Lengkap" error={errors.address?.message} {...register('address')} />
              </div>

              <Input label="Kota / Kabupaten" error={errors.city?.message} {...register('city')} />
              <Input label="Provinsi" error={errors.province?.message} {...register('province')} />
            </div>
          </div>

          {/* Section: Academic Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-100">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-neutral-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">2</div>
              <h2 className="text-xl font-bold text-neutral-900">Riwayat Akademis (UIKA)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.role === 'STUDENT' && (
                <div className="md:col-span-2">
                  <Input label="Nomor Induk Mahasiswa (NIM)" error={errors.nim?.message} {...register('nim')} disabled />
                  <p className="text-xs text-neutral-400 mt-1">NIM terikat dengan akun dan tidak dapat diubah.</p>
                </div>
              )}
              
              <Input label="Fakultas" placeholder="Contoh: Fakultas Teknik" error={errors.faculty?.message} {...register('faculty')} />
              <Input label="Program Studi / Jurusan" placeholder="Contoh: Teknik Informatika" error={errors.major?.message} {...register('major')} />
              
              {user.role === 'ALUMNI' && (
                <div className="md:col-span-2 sm:w-1/2">
                  <Input label="Tahun Lulus" type="number" placeholder="Contoh: 2024" error={errors.graduationYear?.message} {...register('graduationYear')} />
                </div>
              )}
            </div>
          </div>

          {/* Section: Social & Portfolio */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-100">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-neutral-100">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">3</div>
              <h2 className="text-xl font-bold text-neutral-900">Tautan Portofolio Profesional</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/username" error={errors.linkedinUrl?.message} {...register('linkedinUrl')} />
              <Input label="GitHub URL" placeholder="https://github.com/username" error={errors.githubUrl?.message} {...register('githubUrl')} />
              <Input label="Website Portofolio / Lainnya" placeholder="https://myportfolio.com" error={errors.portfolioUrl?.message} {...register('portfolioUrl')} />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-4">
            <Button type="submit" variant="primary" className="px-12 py-4 text-lg shadow-xl shadow-primary-500/30 hover:-translate-y-1 transition-transform" isLoading={isSaving}>
              {isSaving ? 'Menyimpan Data...' : 'Simpan Seluruh Profil'}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
