'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { cvsApi } from '@/lib/api/cvs';
import { applicationsApi } from '@/lib/api/applications';
import { Application, CV } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  
  // States for dashboard data
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    views: 0,
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [primaryCv, setPrimaryCv] = useState<CV | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch CVs to find primary
        const cvs = await cvsApi.getAll();
        const mainCv = cvs.find(cv => cv.isPrimary) || (cvs.length > 0 ? cvs[0] : null);
        setPrimaryCv(mainCv);

        // Fetch applications
        const appsResponse = await applicationsApi.getMyApplications();
        const apps = appsResponse.data || [];
        
        // Calculate stats
        const interviews = apps.filter(app => app.status === 'INTERVIEW').length;
        setStats({
          applications: apps.length,
          interviews,
          views: mainCv?.viewCount || 0,
        });
        
        // Set recent
        setRecentApplications(apps.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Provide realistic placeholder if user name isn't fully loaded
  const firstName = user?.name ? user.name.split(' ')[0] : 'Mahasiswa';

  return (
    <div className="p-4 sm:p-8">
      {/* Header Area */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Halo, {firstName} 👋</h1>
            <p className="text-neutral-500 text-sm mt-1">Berikut adalah ringkasan karir Anda hari ini.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/cv/baru" className="btn-primary btn-sm px-6">Buat CV Baru</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Lamaran', value: stats.applications, color: 'bg-blue-500' },
                { label: 'Panggilan Wawancara', value: stats.interviews, color: 'bg-green-500' },
                { label: 'CV Dilihat', value: stats.views, color: 'bg-accent-500' },
              ].map((stat) => (
                <div key={stat.label} className="card p-4 sm:p-6 border-l-4" style={{ borderColor: 'var(--color-primary-500)' }}>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">{stat.label}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-neutral-900">
                    {isLoading ? <div className="skeleton w-12 h-8"></div> : stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Application Status (Table-like) */}
            <div className="card overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-heading font-bold text-base sm:text-lg">Lamaran Terbaru</h3>
                <Link href="/dasbor/lowongan" className="text-xs text-primary-600 font-bold hover:underline">Lihat Semua</Link>
              </div>
              <div className="overflow-x-auto scrollbar-hide min-h-[150px]">
                {isLoading ? (
                  <div className="p-6 space-y-4">
                    <div className="skeleton h-10 w-full rounded"></div>
                    <div className="skeleton h-10 w-full rounded"></div>
                  </div>
                ) : recentApplications.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500 text-sm">
                    Belum ada lamaran terkirim. Mulai melamar sekarang!
                  </div>
                ) : (
                  <table className="w-full text-left min-w-[500px]">
                    <thead>
                      <tr className="bg-neutral-50 text-xs uppercase text-neutral-400 font-bold">
                        <th className="px-6 py-4">Posisi</th>
                        <th className="px-6 py-4">Perusahaan</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {recentApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-neutral-900">{app.job?.title || 'Posisi Tidak Diketahui'}</td>
                          <td className="px-6 py-4 text-neutral-600">{app.job?.company?.name || 'Perusahaan'}</td>
                          <td className="px-6 py-4">
                            <span className={`badge ${
                              app.status === 'INTERVIEW' ? 'badge-info' : 
                              app.status === 'REJECTED' ? 'badge-error' :
                              app.status === 'ACCEPTED' ? 'badge-success' : 'badge-warning'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-neutral-400">
                            {new Date(app.appliedAt).toLocaleDateString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8">
            {/* Quick Profile/CV */}
            <div className="card p-6 bg-gradient-primary text-white">
              <h3 className="font-heading font-bold text-lg mb-2">Skor Profil Anda</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold text-accent-400">85%</span>
                <span className="text-sm text-primary-200 mb-1">Sangat Baik</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full mb-6">
                <div className="bg-accent-400 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
              <Link href="/profil" className="w-full flex justify-center py-2 bg-white text-primary-900 rounded-xl text-sm font-bold hover:bg-accent-50 transition-colors block text-center">
                Lengkapi Profil
              </Link>
            </div>

            {/* Active CVs */}
            <div className="card p-6">
              <h3 className="font-heading font-bold text-neutral-900 mb-4">CV Utama</h3>
              
              {isLoading ? (
                <div className="skeleton h-24 w-full rounded-xl"></div>
              ) : primaryCv ? (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-primary-100 bg-primary-50/30">
                  <div className="w-12 h-16 bg-white rounded border border-neutral-200 flex items-center justify-center text-2xl shadow-sm">
                    📄
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-bold text-neutral-900 text-sm truncate" title={primaryCv.title}>{primaryCv.title}</div>
                    <div className="text-xs text-neutral-500">Update: {new Date(primaryCv.updatedAt).toLocaleDateString('id-ID')}</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center rounded-xl border border-dashed border-neutral-300 text-neutral-500 text-sm">
                  Anda belum memiliki CV.
                </div>
              )}
              <Link href="/cv" className="btn-secondary w-full mt-4 btn-sm">Kelola Semua CV</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
