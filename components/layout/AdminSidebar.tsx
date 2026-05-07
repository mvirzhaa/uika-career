'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: '📊', href: '/admin' },
    { label: 'Pengguna', icon: '👥', href: '/admin/users' },
    { label: 'Perusahaan', icon: '🏢', href: '/admin/companies' },
    { label: 'Lowongan', icon: '💼', href: '/admin/jobs' },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] text-neutral-300 min-h-screen hidden lg:flex flex-col border-r border-neutral-800 shadow-[20px_0_40px_rgba(0,0,0,0.1)] fixed left-0 top-0 z-50">
      
      {/* Brand Logo */}
      <div className="h-20 flex items-center gap-4 px-6 border-b border-neutral-800 bg-gradient-to-b from-neutral-900/50 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 relative z-10">
          <span className="text-white text-sm font-bold">U</span>
        </div>
        <div className="flex flex-col relative z-10">
          <span className="font-heading font-extrabold text-white tracking-wide text-lg leading-tight">Admin Portal</span>
          <span className="text-[10px] uppercase font-bold text-primary-400 tracking-wider">UIKA Career</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = item.href === '/admin' 
            ? pathname === '/admin' 
            : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative
                ${isActive 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/25 translate-x-1' 
                  : 'hover:bg-neutral-800 hover:text-white text-neutral-400 hover:translate-x-1'
                }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              )}
              <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Area / Logout */}
      <div className="p-4 border-t border-neutral-800/50 bg-neutral-900/30">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">🚪</span>
          Keluar (Logout)
        </button>
      </div>
    </aside>
  );
};
