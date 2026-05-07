"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';

export default function RegisterFormClient() {
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'alumni'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    nim: '',
    graduationYear: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.register({
        role,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        ...(role === 'student' ? { nim: formData.nim } : {}),
        ...(role === 'alumni' ? { graduationYear: Number(formData.graduationYear) } : {}),
      });
      alert('Registrasi berhasil! Silakan login.');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal. Pastikan email atau NIM belum terdaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
          {error}
        </div>
      )}
      {/* Tombol Pilihan Role Dinamis */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
          type="button" 
          onClick={() => setRole('student')}
          className={`p-3 rounded-xl border-2 transition-all text-sm flex flex-col items-center gap-1 ${
            role === 'student' 
              ? 'border-primary-500 bg-primary-50 text-primary-900 font-medium' 
              : 'border-neutral-100 bg-white text-neutral-600 hover:border-primary-200'
          }`}
        >
          <span className="text-xl">🧑‍🎓</span> Mahasiswa
        </button>
        
        <button 
          type="button" 
          onClick={() => setRole('alumni')}
          className={`p-3 rounded-xl border-2 transition-all text-sm flex flex-col items-center gap-1 ${
            role === 'alumni' 
              ? 'border-primary-500 bg-primary-50 text-primary-900 font-medium' 
              : 'border-neutral-100 bg-white text-neutral-600 hover:border-primary-200'
          }`}
        >
          <span className="text-xl">👨‍💼</span> Alumni
        </button>
      </div>

      <div>
        <label className="label">Nama Lengkap</label>
        <input 
          type="text" 
          className="input" 
          placeholder="Masukkan nama sesuai KTM" 
          required 
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
        />
      </div>

      <div>
        <label className="label">Email Universitas</label>
        <input 
          type="email" 
          className="input" 
          placeholder="npm@uika.ac.id" 
          required 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>

      {role === 'alumni' && (
        <div className="animate-slide-up">
          <label className="label">Tahun Lulus</label>
          <input 
            type="number" 
            className="input" 
            placeholder="Contoh: 2024" 
            required={role === 'alumni'} 
            value={formData.graduationYear}
            onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
          />
        </div>
      )}

      {role === 'student' && (
        <div className="animate-slide-up">
          <label className="label">NIM (Nomor Induk Mahasiswa)</label>
          <input 
            type="text" 
            className="input" 
            placeholder="2021001..." 
            required={role === 'student'} 
            value={formData.nim}
            onChange={(e) => setFormData({...formData, nim: e.target.value})}
          />
        </div>
      )}

      <div>
        <label className="label">Kata Sandi</label>
        <input 
          type="password" 
          className="input" 
          placeholder="Min. 8 karakter" 
          required 
          minLength={8}
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
      </div>

      <p className="text-[10px] text-neutral-400 text-center leading-tight">
        Dengan mendaftar, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi UIKA Career Portal.
      </p>

      <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-4 flex justify-center items-center gap-2">
        {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Daftar Sekarang'}
      </button>
    </form>
  );
}