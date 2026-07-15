import axios, { AxiosAdapter, AxiosResponse } from "axios";
import { Application, Job, Role, User } from "../types";

const apiUrl = import.meta.env.VITE_API_URL;
const useDemoApi = !apiUrl;

const demoUsers: User[] = [
  { id: 1, name: "Avery Admin", email: "admin@talentflow.dev", role: "admin", status: "active" },
  { id: 2, name: "Riley Recruiter", email: "recruiter@talentflow.dev", role: "recruiter", status: "active" },
  { id: 3, name: "Casey Candidate", email: "candidate@talentflow.dev", role: "candidate", status: "active" },
  { id: 4, name: "Jordan Lee", email: "jordan.lee@example.com", role: "candidate", status: "active" },
  { id: 5, name: "Morgan Patel", email: "morgan.patel@example.com", role: "recruiter", status: "suspended" }
];

const demoJobs: Job[] = [
  { id: 1, title: "Senior Full Stack Engineer", company_name: "Northstar Labs", location: "Remote", salary_min: 120000, salary_max: 170000, job_type: "full_time", work_mode: "remote", skills: "React,TypeScript,Node.js,MySQL", status: "active" },
  { id: 2, title: "Product Designer", company_name: "Atlas Cloud", location: "New York", salary_min: 95000, salary_max: 130000, job_type: "full_time", work_mode: "hybrid", skills: "Figma,Research,Systems", status: "active" },
  { id: 3, title: "Data Platform Engineer", company_name: "SignalWorks", location: "Austin", salary_min: 130000, salary_max: 180000, job_type: "full_time", work_mode: "onsite", skills: "Python,MySQL,AWS,Docker", status: "active" },
  { id: 4, title: "Talent Operations Analyst", company_name: "BrightHire", location: "Chicago", salary_min: 78000, salary_max: 105000, job_type: "full_time", work_mode: "hybrid", skills: "SQL,Dashboards,Recruiting Ops", status: "active" }
];

let demoApplications: Application[] = [
  { id: 1, candidate_name: "Casey Candidate", candidate_email: "candidate@talentflow.dev", job_title: "Senior Full Stack Engineer", title: "Senior Full Stack Engineer", company_name: "Northstar Labs", status: "shortlisted", ats_score: 88 },
  { id: 2, candidate_name: "Jordan Lee", candidate_email: "jordan.lee@example.com", job_title: "Frontend Architect", title: "Frontend Architect", company_name: "Atlas Cloud", status: "under_review", ats_score: 81 },
  { id: 3, candidate_name: "Priya Shah", candidate_email: "priya.shah@example.com", job_title: "Data Platform Engineer", title: "Data Platform Engineer", company_name: "SignalWorks", status: "interview_scheduled", ats_score: 91 }
];

function parseBody(data: unknown) {
  if (!data) return {};
  return typeof data === "string" ? JSON.parse(data) : data;
}

function inferRole(email: string): Role {
  if (email.includes("admin")) return "admin";
  if (email.includes("recruiter")) return "recruiter";
  return "candidate";
}

function response(config: Parameters<AxiosAdapter>[0], data: unknown, status = 200): AxiosResponse {
  return { data, status, statusText: "OK", headers: {}, config, request: {} };
}

const demoAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 180));
  const method = (config.method || "get").toLowerCase();
  const url = config.url || "";
  const body = parseBody(config.data) as Record<string, string>;

  if (method === "post" && url === "/auth/login") {
    const user = demoUsers.find((item) => item.email === body.email) || {
      id: Date.now(),
      name: body.email?.split("@")[0] || "Demo User",
      email: body.email || "candidate@talentflow.dev",
      role: inferRole(body.email || ""),
      status: "active"
    };
    return response(config, { accessToken: "demo-access-token", refreshToken: "demo-refresh-token", user });
  }

  if (method === "post" && url === "/auth/register") {
    const user: User = { id: Date.now(), name: body.name, email: body.email, role: body.role as Role, status: "active" };
    demoUsers.push(user);
    return response(config, { accessToken: "demo-access-token", refreshToken: "demo-refresh-token", user }, 201);
  }

  if (method === "post" && url === "/auth/forgot-password") return response(config, { message: "Reset email queued" });

  if (method === "get" && url === "/admin/dashboard") {
    return response(config, {
      totals: { totalUsers: 1284, totalRecruiters: 124, totalApplicants: 944, jobsPosted: 386, applicationsReceived: 8230, interviewsScheduled: 318, pendingReviews: 74, activeJobs: 182, inactiveJobs: 47 },
      monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({ month, applications: 180 + index * 42 })),
      activities: [{ title: "Recruiter approved", body: "Northstar Labs was approved." }, { title: "New job posted", body: "SignalWorks opened a Data Platform role." }],
      notifications: [{ title: "Hiring SLA", body: "Review response time improved by 12%." }]
    });
  }

  if (method === "get" && url === "/admin/users") return response(config, { data: demoUsers });

  if (method === "patch" && url.startsWith("/admin/users/")) {
    const id = Number(url.split("/")[3]);
    const user = demoUsers.find((item) => item.id === id);
    if (user) user.status = body.status;
    return response(config, { data: user });
  }

  if (method === "delete" && url.startsWith("/admin/users/")) {
    const id = Number(url.split("/")[3]);
    const index = demoUsers.findIndex((item) => item.id === id);
    if (index >= 0) demoUsers.splice(index, 1);
    return response(config, { success: true });
  }

  if (method === "get" && url === "/recruiter/analytics") {
    return response(config, { funnel: [{ status: "applied", count: 23 }, { status: "under_review", count: 14 }, { status: "shortlisted", count: 8 }, { status: "interview_scheduled", count: 5 }, { status: "selected", count: 3 }] });
  }

  if (method === "get" && url === "/recruiter/applications") return response(config, { data: demoApplications });
  if (method === "get" && url === "/candidate/recommendations") return response(config, { data: demoJobs.slice(0, 3) });
  if (method === "get" && url === "/candidate/applications") return response(config, { data: demoApplications });

  if (method === "get" && url === "/jobs") {
    const q = String(config.params?.q || "").toLowerCase();
    const location = String(config.params?.location || "").toLowerCase();
    const data = demoJobs.filter((job) => {
      const searchable = `${job.title} ${job.company_name} ${job.skills}`.toLowerCase();
      return (!q || searchable.includes(q)) && (!location || job.location.toLowerCase().includes(location));
    });
    return response(config, { data });
  }

  if (method === "post" && /^\/candidate\/jobs\/\d+\/apply$/.test(url)) {
    const jobId = Number(url.split("/")[3]);
    const job = demoJobs.find((item) => item.id === jobId);
    if (job && !demoApplications.some((item) => item.job_title === job.title)) {
      demoApplications = [...demoApplications, { id: Date.now(), title: job.title, job_title: job.title, company_name: job.company_name, status: "applied", ats_score: 84 }];
    }
    return response(config, { success: true }, 201);
  }

  return response(config, { data: null });
};

export const api = axios.create({
  baseURL: apiUrl || "/demo-api",
  adapter: useDemoApi ? demoAdapter : undefined
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
