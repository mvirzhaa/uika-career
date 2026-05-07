// src/types/job.types.ts

export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  is_verified: boolean;
  industry: string;
}

export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  work_type: 'onsite' | 'remote' | 'hybrid';
  employment_type: 'fulltime' | 'parttime' | 'internship' | 'freelance' | 'contract';
  salary_min?: number;
  salary_max?: number;
  skills_required: string[];
  deadline_at: string;
  created_at: string;
}