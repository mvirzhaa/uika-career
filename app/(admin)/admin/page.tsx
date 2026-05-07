'use client';

import { useEffect, useState } from 'react';
import { adminApi, AdminAnalytics } from '@/lib/api/admin';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminApi.getAnalytics();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">Dashboard Utama</h1>
          <p className="text-primary-100 text-lg max-w-2xl">Ringkasan statistik operasional dan performa platform UIKA Career secara real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Pengguna', value: stats?.totalUsers, icon: '👥', color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
          { label: 'Lowongan Aktif', value: stats?.totalJobs, icon: '💼', color: 'from-green-500 to-green-600', shadow: 'shadow-green-500/20' },
          { label: 'Lamaran Masuk', value: stats?.totalApplications, icon: '📬', color: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/20' },
          { label: 'Mitra Perusahaan', value: stats?.totalCompanies, icon: '🏢', color: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-500/20' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">{stat.label}</div>
                <div className="text-4xl font-black text-neutral-900 tracking-tight">
                  {isLoading ? <div className="skeleton w-20 h-10 rounded-lg"></div> : (stat.value || 0)}
                </div>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-12 text-center mt-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50 via-white to-white opacity-50"></div>
        <div className="relative z-10">
          <div className="text-6xl mb-6 animate-bounce">🚀</div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Sistem Berjalan Optimal</h2>
          <p className="text-neutral-500 mt-3 max-w-lg mx-auto text-lg">Semua modul berfungsi dengan baik. Gunakan navigasi di sebelah kiri untuk mulai mengelola entitas secara mendetail.</p>
        </div>
      </div>
    </div>
  );
}
