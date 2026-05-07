import Link from 'next/link';

export default function PublicCVPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black font-heading mb-6 tracking-tight">
            CV Cerdas, <span className="text-accent-400">Karir Meluas</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Gunakan CV Builder terintegrasi kami untuk menghasilkan profil profesional berstandar industri (ATS-friendly) dalam hitungan menit.
          </p>
          <Link href="/register" className="btn-accent py-4 px-10 text-lg shadow-xl shadow-accent-500/20">
            Buat CV Sekarang
          </Link>
        </div>
      </section>

      {/* Showcase */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-primary-900 font-heading">
              Standar Industri di Genggaman Anda
            </h2>
            <ul className="space-y-6">
              {[
                { title: 'Lolos Sistem ATS', desc: 'Struktur data kami telah dioptimalkan agar CV Anda mudah dibaca oleh robot rekrutmen.' },
                { title: 'Otomatis Terhubung Profil', desc: 'Isi profil UIKA sekali, dan CV akan tergenerate otomatis kapan saja Anda butuhkan.' },
                { title: 'Export PDF Kualitas Tinggi', desc: 'Unduh dokumen Anda dalam format PDF resolusi tinggi untuk dikirim di luar portal.' },
              ].map(f => (
                <li key={f.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 shrink-0 text-xl font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">{f.title}</h4>
                    <p className="text-neutral-600 text-sm">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-neutral-100 rounded-3xl p-8 border-4 border-white shadow-2xl relative">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent-400 rounded-full blur-2xl opacity-50"></div>
            <div className="bg-white w-full aspect-[1/1.4] rounded-xl shadow-sm border border-neutral-200 p-6 flex flex-col gap-4">
               {/* Mockup CV */}
               <div className="flex gap-4 items-center border-b pb-4">
                 <div className="w-16 h-16 rounded-full bg-neutral-200"></div>
                 <div>
                   <div className="w-32 h-4 bg-primary-900 rounded mb-2"></div>
                   <div className="w-24 h-3 bg-neutral-300 rounded"></div>
                 </div>
               </div>
               <div className="w-full h-3 bg-neutral-200 rounded"></div>
               <div className="w-5/6 h-3 bg-neutral-200 rounded"></div>
               <div className="w-4/6 h-3 bg-neutral-200 rounded mb-4"></div>
               
               <div className="w-20 h-4 bg-primary-700 rounded mb-2"></div>
               <div className="w-full h-16 bg-neutral-100 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
