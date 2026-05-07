import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lupa Kata Sandi | UIKA Career Portal',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-card-hover p-8 sm:p-10 border border-neutral-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
            🔑
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Lupa Kata Sandi?</h1>
          <p className="text-neutral-500 mt-2 text-sm leading-relaxed">
            Jangan khawatir! Masukkan email universitas Anda dan kami akan mengirimkan instruksi pemulihan.
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="label">Email Universitas</label>
            <input type="email" className="input" placeholder="contoh@uika.ac.id" />
          </div>

          <button type="submit" className="btn-primary w-full py-3">
            Kirim Link Pemulihan
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm text-neutral-500 hover:text-primary-600 font-medium transition-colors">
            ← Kembali ke Halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
}
