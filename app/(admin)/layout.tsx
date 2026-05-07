'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth finishes loading and user is not admin, kick them out
    if (!isLoading && isAuthenticated && user?.role?.toUpperCase() !== 'ADMIN') {
      router.replace('/dasbor');
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Prevent rendering anything if not admin (double protection before redirect kicks in)
  if (!isAuthenticated || user?.role?.toUpperCase() !== 'ADMIN') {
    return null; 
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Simple topbar for Admin */}
        <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-8 h-16 flex items-center justify-between shadow-sm">
           <div>
             <h2 className="font-bold text-neutral-800">Sistem Kendali Utama</h2>
           </div>
           <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <div className="text-sm font-bold text-neutral-900">{user.name}</div>
               <div className="text-[10px] uppercase font-bold text-red-500">Administrator</div>
             </div>
             <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl border border-red-200">
               🛡️
             </div>
           </div>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
