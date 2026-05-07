'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-4 sm:px-8">
      {/* Mobile Trigger or Logo area for mobile */}
      <div className="flex items-center gap-4 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
          <span className="text-white text-xs font-bold">U</span>
        </div>
      </div>

      <div className="hidden lg:block flex-1">
        {/* Search Bar Placeholder or Page Title can go here */}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification Bell */}
        <button className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center text-xl text-neutral-500 transition-colors relative">
          🔔
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-6 w-px bg-neutral-200 mx-2 hidden sm:block"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-32 h-10 skeleton rounded-full"></div>
          ) : isAuthenticated && user ? (
            <Link href="/profil" className="flex items-center gap-3 hover:bg-neutral-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs uppercase overflow-hidden border border-primary-200 shadow-sm">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  (user.name || 'U').substring(0, 2)
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-bold text-neutral-900 leading-tight">{user.name || 'Pengguna'}</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">{user.role}</div>
              </div>
            </Link>
          ) : (
            <Link href="/login" className="btn-primary btn-sm">Masuk</Link>
          )}
        </div>
      </div>
    </header>
  );
};
