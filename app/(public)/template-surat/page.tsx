import Link from 'next/link';

export default function PublicCoverLetterPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-50 text-neutral-900 pt-24 pb-20 px-4 border-b border-primary-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-primary-200 rounded-full px-4 py-1.5 mb-8">
            <span className="text-xl">✍️</span>
            <span className="text-primary-700 text-xs font-bold uppercase tracking-wider">Pembuat Surat Lamaran Terotomatisasi</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-heading mb-6 tracking-tight text-primary-900">
            Tinggalkan Kesan Pertama yang <span className="text-accent-600">Tak Terlupakan</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Surat lamaran yang baik membuka pintu wawancara. Gunakan koleksi template profesional kami untuk menulis dengan penuh percaya diri.
          </p>
          <Link href="/register" className="btn-primary py-4 px-10 text-lg shadow-xl shadow-primary-500/20">
            Mulai Menulis Surat
          </Link>
        </div>
      </section>

      {/* Templates */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-bold text-primary-900 font-heading mb-4">Pilihan Gaya Penulisan</h2>
           <p className="text-neutral-500">Sesuaikan *tone* surat dengan karakter perusahaan yang Anda tuju.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { title: 'Korporat Formal', icon: '🏢', desc: 'Gaya bahasa resmi dan terstruktur. Cocok untuk perbankan, BUMN, dan firma hukum.' },
             { title: 'Kreatif Kasual', icon: '🎨', desc: 'Lebih luwes dan menonjolkan karakter unik. Ideal untuk agensi, startup, dan media.' },
             { title: 'Akademis', icon: '🎓', desc: 'Fokus pada riset dan publikasi. Tepat untuk dosen, asisten lab, atau peneliti.' }
           ].map(t => (
             <div key={t.title} className="card p-8 border-t-4 border-t-primary-500 hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl mb-6">{t.icon}</div>
                <h3 className="font-bold text-xl text-neutral-900 mb-3">{t.title}</h3>
                <p className="text-neutral-600 leading-relaxed mb-6">{t.desc}</p>
                <Link href="/register" className="text-primary-700 font-bold hover:text-primary-800">Coba Template Ini →</Link>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}
