import { PublicNavbar } from '@/components/layout/PublicNavbar';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      <PublicNavbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      
      {/* Public Footer */}
      <footer className="bg-primary-900 border-t border-primary-800 pt-16 pb-8 text-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <span className="text-primary-900 text-sm font-bold">U</span>
                </div>
                <span className="font-heading font-bold text-white text-xl">UIKA Career Portal</span>
              </div>
              <p className="text-primary-200 max-w-sm leading-relaxed text-sm">
                Platform resmi pengembangan karir bagi mahasiswa dan alumni Universitas Ibn Khaldun Bogor. Wujudkan karir impian Anda bersama kami.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Layanan</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/lowongan" className="hover:text-accent-400 transition-colors">Lowongan Kerja</Link></li>
                <li><Link href="/cv-builder" className="hover:text-accent-400 transition-colors">Pembuat CV</Link></li>
                <li><Link href="/template-surat" className="hover:text-accent-400 transition-colors">Surat Lamaran</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Bantuan</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-accent-400 transition-colors">Panduan</a></li>
                <li><a href="#" className="hover:text-accent-400 transition-colors">Kontak</a></li>
                <li><a href="#" className="hover:text-accent-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-primary-800 text-sm text-primary-400 text-center flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Universitas Ibn Khaldun Bogor. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
