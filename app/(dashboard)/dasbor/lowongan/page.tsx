'use client';

import { useState, useEffect } from 'react';
import { JobListings } from '@/components/jobs/JobListings';
import { applicationsApi } from '@/lib/api/applications';
import { Application, ApplicationStatusLabel } from '@/types';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardJobsPage() {
  const [activeTab, setActiveTab] = useState<'explore' | 'my-applications'>('explore');
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Semua');

  const fetchApplications = async () => {
    try {
      setIsLoadingApps(true);
      const res = await applicationsApi.getMyApplications();
      setApplications(res.data || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoadingApps(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-applications') {
      fetchApplications();
    }
  }, [activeTab]);

  const handleWithdraw = async (id: string) => {
    if (confirm('Yakin ingin menarik lamaran ini?')) {
      try {
        await applicationsApi.withdraw(id);
        fetchApplications();
      } catch (error) {
        alert('Gagal menarik lamaran.');
      }
    }
  };

  const statusTabs = ['Semua', 'SUBMITTED', 'REVIEWED', 'INTERVIEW', 'ACCEPTED', 'REJECTED'];
  const filteredApps = filterStatus === 'Semua' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Lowongan & Lamaran</h1>
            <p className="text-neutral-500 mt-1">Jelajahi peluang karir dan pantau progres lamaran Anda.</p>
          </div>
          
          <div className="flex bg-neutral-100 p-1 rounded-2xl w-fit border border-neutral-200">
            <button 
              onClick={() => setActiveTab('explore')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'explore' ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              🔍 Cari Lowongan
            </button>
            <button 
              onClick={() => setActiveTab('my-applications')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'my-applications' ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              📑 Lamaran Saya
            </button>
          </div>
        </div>

        {activeTab === 'explore' ? (
          <div className="animate-fade-in">
            <JobListings basePath="/dasbor/lowongan" />
          </div>
        ) : (
          <div className="animate-fade-in space-y-8">
            {/* Filter Status Lamaran */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {statusTabs.map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setFilterStatus(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all
                    ${filterStatus === tab 
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md' 
                      : 'bg-white text-neutral-500 border-neutral-200 hover:border-primary-300'}`}
                >
                  {tab === 'Semua' ? 'Semua' : ApplicationStatusLabel[tab as keyof typeof ApplicationStatusLabel] || tab}
                  {tab === 'Semua' && <span className="ml-1.5 opacity-60">({applications.length})</span>}
                </button>
              ))}
            </div>

            {isLoadingApps ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 w-full rounded-3xl"></div>)}
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border-2 border-dashed border-neutral-200">
                 <div className="text-7xl mb-6 grayscale opacity-50">📤</div>
                 <h3 className="text-xl font-bold text-neutral-900">Belum ada lamaran</h3>
                 <p className="text-neutral-500 max-w-sm mx-auto mt-2">Segera kirimkan lamaran terbaik Anda untuk mendapatkan pekerjaan impian.</p>
                 <Button variant="primary" className="mt-8" onClick={() => setActiveTab('explore')}>Cari Lowongan Sekarang</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredApps.map((app) => (
                  <div key={app.id} className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-3xl overflow-hidden shrink-0 shadow-inner">
                      {app.job?.company?.logoUrl ? <img src={app.job.company.logoUrl} alt="Logo" className="w-full h-full object-cover"/> : '🏢'}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left min-w-0">
                      <h3 className="font-bold text-neutral-900 text-xl truncate hover:text-primary-600 transition-colors">
                        <Link href={`/dasbor/lowongan/${app.jobId}`}>{app.job?.title || 'Posisi Pekerjaan'}</Link>
                      </h3>
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1 text-sm text-neutral-500 mt-1">
                        <span className="font-medium text-neutral-700">{app.job?.company?.name || 'Perusahaan'}</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300 hidden md:block"></span>
                        <span>Dilamar pada {new Date(app.appliedAt || app.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                       <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                        app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        app.status === 'INTERVIEW_SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                        'bg-neutral-100 text-neutral-600'
                      }`}>
                        {ApplicationStatusLabel[app.status] || app.status}
                      </span>
                      
                      {['submitted', 'reviewing'].includes(app.status.toLowerCase()) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleWithdraw(app.id)} 
                          className="text-red-500 hover:bg-red-50 font-bold"
                        >
                          Tarik
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
