export type Role = "admin" | "recruiter" | "candidate";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: string;
};

export type Job = {
  id: number;
  title: string;
  company_name?: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  job_type: string;
  work_mode: string;
  skills: string;
  status: string;
};

export type Application = {
  id: number;
  candidate_name?: string;
  candidate_email?: string;
  job_title?: string;
  title?: string;
  company_name?: string;
  status: string;
  ats_score?: number;
  resume_url?: string;
};
