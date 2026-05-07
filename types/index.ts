// ============================================================
// UIKA Career Portal — TypeScript Type Definitions
// ============================================================

// ── Auth ─────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  nim?: string;
  name: string;
  role: 'student' | 'alumni' | 'company_hr' | 'admin' | 'STUDENT' | 'ALUMNI' | 'COMPANY' | 'ADMIN';
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  city?: string;
  province?: string;
  headline?: string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  nim?: string;
  faculty?: string;
  major?: string;
  graduationYear?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  role?: 'student' | 'alumni';
  nim?: string;
  graduationYear?: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

// ── CV ───────────────────────────────────────────────────────

export type CVTemplateType = 'MODERN' | 'CLASSIC' | 'CREATIVE';

export interface CV {
  id: string;
  userId: string;
  title: string;
  templateType?: CVTemplateType;
  isPrimary: boolean;
  isPublic?: boolean;
  shareToken?: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  sections?: CVSection[];
}

export interface CVSection {
  id: string;
  cvId: string;
  type: CVSectionType;
  title: string;
  order?: number;
  orderIndex?: number;
  isVisible?: boolean;
  content: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export type CVSectionType =
  | 'summary'
  | 'education'
  | 'experience'
  | 'skill'
  | 'project'
  | 'certification'
  | 'organization'
  | 'award'
  | 'language'
  | 'reference'
  | 'custom'
  | 'PERSONAL_INFO'
  | 'SUMMARY'
  | 'EDUCATION'
  | 'WORK_EXPERIENCE'
  | 'SKILLS'
  | 'PROJECTS'
  | 'CERTIFICATIONS'
  | 'LANGUAGES'
  | 'AWARDS'
  | 'INTERESTS'
  | 'CUSTOM';

export interface CreateCVDto {
  title: string;
  templateType?: CVTemplateType;
}

export interface UpdateCVDto {
  title?: string;
  templateType?: CVTemplateType;
  isPrimary?: boolean;
  isPublic?: boolean;
}

// ── Cover Letter ─────────────────────────────────────────────

export interface CoverLetter {
  id: string;
  userId: string;
  jobId?: string;
  title: string;
  recipientName?: string;
  companyName?: string;
  positionApplied?: string;
  content: string;
  language: 'id' | 'en';
  status: 'draft' | 'finalized';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoverLetterDto {
  title: string;
  content: string;
  jobId?: string;
  recipientName?: string;
  companyName?: string;
  positionApplied?: string;
  language?: 'id' | 'en';
  status?: 'draft' | 'finalized';
}

// ── Job / Lowongan ───────────────────────────────────────────

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'FREELANCE' | 'CONTRACT';
export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'DIRECTOR';
export type WorkLocation = 'ONSITE' | 'REMOTE' | 'HYBRID';

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  jobType: JobType;
  employmentType: string;
  experienceLevel: ExperienceLevel;
  workLocation: WorkLocation;
  city?: string;
  province?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  isActive: boolean;
  status: string;
  closingDate?: string;
  deadlineAt?: string;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  skills?: JobSkill[];
}

export interface JobSkill {
  id: string;
  jobId: string;
  skillName: string;
  isRequired: boolean;
}

export interface JobFilters {
  search?: string;
  jobType?: JobType[];
  workLocation?: WorkLocation[];
  experienceLevel?: ExperienceLevel[];
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
}

// ── Company ──────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  industry?: string;
  size?: string;
  website?: string;
  city?: string;
  province?: string;
  description?: string;
  isVerified: boolean;
}

// ── Application / Lamaran ────────────────────────────────────

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'REVIEWED'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export const ApplicationStatusLabel: Record<ApplicationStatus, string> = {
  SUBMITTED: 'Terkirim',
  REVIEWED: 'Ditinjau',
  SHORTLISTED: 'Shortlist',
  INTERVIEW: 'Wawancara',
  INTERVIEW_SCHEDULED: 'Jadwal Wawancara',
  OFFERED: 'Penawaran',
  ACCEPTED: 'Diterima',
  REJECTED: 'Ditolak',
  WITHDRAWN: 'Ditarik',
};

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  cvId?: string;
  coverLetterId?: string;
  status: ApplicationStatus;
  coverLetterText?: string;
  notes?: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  cv?: CV;
}

export interface CreateApplicationDto {
  jobId: string;
  cvId?: string;
  coverLetterId?: string;
  coverLetterText?: string;
}

// ── Notification ─────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

// ── API Response Wrappers ────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
