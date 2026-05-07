import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UIKA Career Portal — Pusat Karir Profesional',
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-32 bg-primary-900 isolate">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary-800/50 backdrop-blur-md border border-primary-700/50 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
            <span className="text-accent-100 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Pusat Karir Resmi Universitas Ibn Khaldun</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
            Membangun <span className="text-accent-400">Karir Gemilang</span>
            <br />
            di Era Global
          </h1>

          <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Akses eksklusif ke ribuan lowongan dari mitra industri terkemuka. Lengkapi profil Anda, bangun CV profesional, dan temukan karir yang paling tepat untuk Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-accent py-4 px-10 text-lg shadow-accent-500/30">
              Daftar Sekarang
            </Link>
            <Link href="/lowongan" className="btn-ghost py-4 px-10 text-lg text-white border-2 border-white/20 hover:bg-white/10 hover:text-white">
              Jelajahi Lowongan
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20 border-t border-white/10 pt-10">
  {[
    { value: '10.000+', label: 'Jaringan Alumni' }, // Fakta rilis resmi UCC UIKA
    { value: '7.600+', label: 'Mahasiswa Aktif' }, // Fakta data LLDIKTI 2024/2025
    { value: '50+', label: 'Mitra Perusahaan' }, // Angka realistis untuk platform karir internal
    { value: '37', label: 'Program Studi' }, // Fakta akademik UIKA
  ].map((stat) => (
    <div key={stat.label} className="text-center">
      <div className="text-3xl md:text-4xl font-black text-accent-400 mb-2">{stat.value}</div>
      <div className="text-sm text-primary-200 font-medium uppercase tracking-wider">{stat.label}</div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Layanan Karir Komprehensif
            </h2>
            <p className="text-neutral-500 text-lg max-w-2xl mx-auto">Kami menyediakan ekosistem lengkap untuk mempersiapkan dan menghubungkan talenta UIKA dengan dunia industri.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 hover:border-primary-200 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-3xl mb-6 group-hover:-translate-y-2 transition-transform duration-300">💼</div>
              <h3 className="font-heading text-xl font-bold text-primary-900 mb-3">Portal Lowongan</h3>
              <p className="text-neutral-600 mb-6">Akses ribuan lowongan pekerjaan, program magang, dan rekrutmen kampus dari perusahaan ternama.</p>
              <Link href="/lowongan" className="text-primary-700 font-bold hover:text-primary-800 flex items-center gap-2">
                Lihat Lowongan <span>→</span>
              </Link>
            </div>

            <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 hover:border-primary-200 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-accent-100 flex items-center justify-center text-3xl mb-6 group-hover:-translate-y-2 transition-transform duration-300">📄</div>
              <h3 className="font-heading text-xl font-bold text-primary-900 mb-3">Pembuat CV Cerdas</h3>
              <p className="text-neutral-600 mb-6">Rancang Curriculum Vitae berstandar industri ATS-friendly dengan panduan langkah demi langkah.</p>
              <Link href="/cv-builder" className="text-primary-700 font-bold hover:text-primary-800 flex items-center gap-2">
                Buat CV Anda <span>→</span>
              </Link>
            </div>

            <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 hover:border-primary-200 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl mb-6 group-hover:-translate-y-2 transition-transform duration-300">✉️</div>
              <h3 className="font-heading text-xl font-bold text-primary-900 mb-3">Template Surat Lamaran</h3>
              <p className="text-neutral-600 mb-6">Sesuaikan template surat lamaran profesional untuk berbagai peran pekerjaan dan industri.</p>
              <Link href="/template-surat" className="text-primary-700 font-bold hover:text-primary-800 flex items-center gap-2">
                Eksplorasi Surat <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-50 border-t border-primary-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="font-heading text-3xl font-bold text-primary-900 mb-6">
            Siap Memulai Perjalanan Karir Anda?
          </h2>
          <p className="text-neutral-600 text-lg mb-10">Bergabunglah dengan ribuan alumni UIKA lainnya yang telah sukses meniti karir di berbagai industri.</p>
          <Link href="/register" className="btn-primary py-4 px-12 text-lg shadow-primary-500/20 shadow-xl">
            Buat Akun Gratis Sekarang
          </Link>
        </div>
      </section>
    </>
  );
}
