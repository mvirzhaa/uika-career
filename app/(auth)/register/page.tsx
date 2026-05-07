'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

const registerSchema = z.object({
  fullName: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter' }),
  email: z.string().email({ message: 'Format email tidak valid' }),
  password: z.string().min(8, { message: 'Kata sandi minimal 8 karakter' }),
  role: z.enum(['student', 'alumni']),
  nim: z.string().optional(),
  graduationYear: z.preprocess((val) => (val ? Number(val) : undefined), z.number().min(1950, { message: 'Tahun tidak valid' }).optional()),
});

type RegisterFormInput = z.input<typeof registerSchema>;
type RegisterFormValues = z.output<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerAuth, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInput, any, RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student',
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    setAuthError(null);
    try {
      await registerAuth(data);
    } catch (error: any) {
      setAuthError(error.response?.data?.message || 'Registrasi gagal. Coba lagi nanti.');
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-card-hover overflow-hidden border border-neutral-100">
        
        {/* Left Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <Link href="/" className="flex items-center gap-2 mb-8 group w-fit">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white text-xs font-bold">U</span>
            </div>
            <span className="font-heading font-bold text-primary-900">UIKA Career</span>
          </Link>

          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Buat Akun Baru</h1>
          <p className="text-neutral-500 mb-8">Bergabung dan mulai bangun perjalanan karir Anda.</p>

          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              ⚠️ {authError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input 
                  label="Nama Lengkap Sesuai KTP"
                  placeholder="Budi Santoso" 
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
              </div>
              
              <div className="col-span-2 sm:col-span-1">
                <label className="label mb-2">Status Akun</label>
                <select className="input appearance-none" {...register('role')}>
                  <option value="student">Mahasiswa Aktif</option>
                  <option value="alumni">Alumni</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
              </div>

              {selectedRole === 'student' && (
                <div className="col-span-2 sm:col-span-1 animate-slide-up">
                  <Input 
                    label="NIM"
                    type="text" 
                    placeholder="2021001..." 
                    error={errors.nim?.message}
                    {...register('nim')}
                    required
                  />
                </div>
              )}

              {selectedRole === 'alumni' && (
                <div className="col-span-2 sm:col-span-1 animate-slide-up">
                  <Input 
                    label="Tahun Lulus"
                    type="number" 
                    placeholder="Contoh: 2024" 
                    error={errors.graduationYear?.message}
                    {...register('graduationYear')}
                    required
                  />
                </div>
              )}

              <div className="col-span-2">
                <Input 
                  label="Email"
                  type="email" 
                  placeholder="Email kampus / pribadi" 
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <div className="col-span-2">
                <Input 
                  label="Kata Sandi"
                  type="password" 
                  placeholder="Minimal 8 karakter" 
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3 mt-4" isLoading={isLoading}>
              Daftar Sekarang
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-primary-600 font-semibold hover:underline">Masuk di sini</Link>
            </p>
          </div>
        </div>

        {/* Right Side: Features */}
        <div className="hidden md:flex bg-neutral-50 p-12 flex-col justify-center border-l border-neutral-100">
           <h3 className="font-heading font-bold text-2xl text-neutral-900 mb-8">
             Mengapa bergabung?
           </h3>
           <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-xl shrink-0">📄</div>
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1">CV Builder Otomatis</h4>
                  <p className="text-sm text-neutral-500">Buat CV profesional standar industri dalam hitungan menit dengan template yang sudah disediakan.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-100 text-accent-700 flex items-center justify-center text-xl shrink-0">💼</div>
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1">Lowongan Terkurasi</h4>
                  <p className="text-sm text-neutral-500">Akses eksklusif ke lowongan magang dan pekerjaan dari perusahaan mitra Universitas Ibn Khaldun.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0">📊</div>
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1">Application Tracker</h4>
                  <p className="text-sm text-neutral-500">Pantau status lamaran kerjamu secara real-time dari satu dashboard terpadu.</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
