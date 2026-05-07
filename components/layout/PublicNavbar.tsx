'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export const PublicNavbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  const links = [
    { label: 'Beranda', href: '/' },
    { label: 'Lowongan', href: '/lowongan' },
    { label: 'Buat CV', href: '/cv-builder' },
    { label: 'Surat Lamaran', href: '/template-surat' },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-white text-lg font-bold">U</span>
          </div>
          <div>
            <div className="font-heading font-black text-primary-900 text-lg leading-tight tracking-tight">UIKA</div>
            <div className="text-accent-600 text-xs font-bold tracking-widest uppercase">Career</div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.label} 
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200
                  ${isActive 
                    ? 'text-primary-700 bg-primary-50' 
                    : 'text-neutral-500 hover:text-primary-700 hover:bg-neutral-50'}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth State */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-20 h-8 rounded-lg skeleton"></div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <Link href={user.role === 'ADMIN' ? '/admin' : '/dasbor'} className="text-sm font-bold text-primary-700 hover:underline hidden sm:block">
                Ke Dashboard →
              </Link>
              <Link href={user.role === 'ADMIN' ? '/admin' : '/dasbor'}>
                <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-primary-200 flex items-center justify-center overflow-hidden hover:border-primary-500 transition-colors cursor-pointer">
                  {user.profile?.fullName ? (
                    <span className="text-primary-800 font-bold">{user.profile.fullName.charAt(0)}</span>
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-ghost hidden sm:inline-flex">Masuk</Link>
              <Link href="/register" className="btn-primary py-2 px-5 text-sm shadow-primary-500/20 shadow-lg">Daftar</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};
