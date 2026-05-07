'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useEffect, useState } from 'react';

// Form validation schema with Zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    setRegistered(new URLSearchParams(window.location.search).get('registered') === '1');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    try {
      await login(data);
      // useAuth hook already handles router.push('/dasbor')
    } catch (error: any) {
      setAuthError(error.response?.data?.message || 'Login gagal. Silakan periksa kembali email dan kata sandi Anda.');
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-card-hover overflow-hidden border border-neutral-100">
        
        {/* Left Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <Link href="/" className="flex items-center gap-2 mb-10 group w-fit">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white text-xs font-bold">U</span>
            </div>
            <span className="font-heading font-bold text-primary-900">UIKA Career</span>
          </Link>

          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Selamat Datang</h1>
          <p className="text-neutral-500 mb-8">Masuk ke akun Anda untuk melanjutkan karir.</p>

          {registered && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-medium">
              Registrasi berhasil. Silakan login dengan akun baru Anda.
            </div>
          )}

          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              ⚠️ {authError}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Input 
              label="Email Mahasiswa/Alumni"
              type="email" 
              placeholder="contoh@uika.ac.id" 
              error={errors.email?.message}
              {...register('email')}
            />
            
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="label mb-0">Kata Sandi</label>
                <Link href="/forgot-password" className="text-xs text-primary-600 hover:underline">Lupa sandi?</Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
              <label htmlFor="remember" className="text-sm text-neutral-600">Ingat saya</label>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
              Masuk Sekarang
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Belum punya akun?{' '}
              <Link href="/register" className="text-primary-600 font-semibold hover:underline">Daftar Gratis</Link>
            </p>
          </div>
        </div>

        {/* Right Side: Illustration/Branding */}
        <div className="hidden md:flex bg-gradient-primary p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Platform Karir <br />
              Terbaik untuk <br />
              <span className="text-accent-400">Insan Akademis.</span>
            </h2>
            <p className="text-primary-100/80 leading-relaxed">
              Dapatkan akses eksklusif ke lowongan kerja mitra UIKA dan bangun portofolio profesionalmu hari ini.
            </p>
          </div>

          <div className="mt-auto relative z-10 flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-accent-400 flex items-center justify-center">
              <span className="text-white text-lg">🎓</span>
            </div>
            <p className="text-white text-sm">
              Sudah lebih dari <span className="font-bold">10,000+</span> mahasiswa bergabung.
            </p>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
}
