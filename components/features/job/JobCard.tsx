// src/components/features/job/JobCard.tsx
import React from 'react';
import { Building2, MapPin, Briefcase, Clock, Bookmark, CheckCircle2 } from 'lucide-react';
import { Job } from '@/types/job.types';

interface JobCardProps {
  job: Job;
  onApply?: (id: string) => void;
  onBookmark?: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply, onBookmark }) => {
  // Fungsi format mata uang
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Gaji Dirahasiakan';
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumSignificantDigits: 3,
    });
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
    return formatter.format(min || max || 0);
  };

  return (
    <div className="card card-hover p-5 flex flex-col gap-4">
      {/* Header Info Perusahaan & Bookmark */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-200">
            {job.company.logo_url ? (
              <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="text-neutral-400 w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-neutral-900 line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5 text-neutral-600 text-sm mt-0.5">
              <span>{job.company.name}</span>
              {job.company.is_verified && (
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
              )}
            </div>
          </div>
        </div>
        <button 
          onClick={() => onBookmark?.(job.id)}
          className="text-neutral-400 hover:text-accent-500 transition-colors p-1"
          aria-label="Simpan Lowongan"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Detail Attributes */}
      <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-neutral-600">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-neutral-400" />
          <span>{job.location} ({job.work_type})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-neutral-400" />
          <span className="capitalize">{job.employment_type}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-neutral-400" />
          <span>Deadline: {new Date(job.deadline_at).toLocaleDateString('id-ID')}</span>
        </div>
      </div>

      {/* Salary & Skills */}
      <div className="mt-1">
        <p className="text-primary-600 font-medium text-sm mb-3">
          {formatSalary(job.salary_min, job.salary_max)}
        </p>
        <div className="flex flex-wrap gap-2">
          {job.skills_required.slice(0, 3).map((skill, index) => (
            <span key={index} className="badge-neutral">
              {skill}
            </span>
          ))}
          {job.skills_required.length > 3 && (
            <span className="badge-neutral">+{job.skills_required.length - 3}</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-2 flex gap-3 pt-4 border-t border-neutral-100">
        <button 
          className="btn-primary flex-1"
          onClick={() => onApply?.(job.id)}
        >
          Lamar Sekarang
        </button>
        <button className="btn-secondary px-6">
          Detail
        </button>
      </div>
    </div>
  );
};