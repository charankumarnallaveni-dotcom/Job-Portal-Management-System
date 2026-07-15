import { ArrowRight, BarChart3, BriefcaseBusiness, Building2, CheckCircle2, LucideIcon, MapPin, Search, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const featuredJobs = [
  {
    title: "Senior Full Stack Engineer",
    company: "Northstar Labs",
    location: "Remote",
    salary: "$120k - $170k",
    skills: ["React", "Node.js", "MySQL"]
  },
  {
    title: "Product Designer",
    company: "Atlas Cloud",
    location: "New York",
    salary: "$95k - $130k",
    skills: ["Figma", "Research", "Systems"]
  },
  {
    title: "Data Platform Engineer",
    company: "SignalWorks",
    location: "Austin",
    salary: "$130k - $180k",
    skills: ["Python", "AWS", "Docker"]
  }
];

const stats = [
  ["8.2k", "Applications tracked"],
  ["386", "Jobs posted"],
  ["124", "Recruiter teams"],
  ["88%", "Top ATS score"]
];

const featureCards: Array<{ icon: LucideIcon; title: string; body: string }> = [
  { icon: ShieldCheck, title: "Secure auth", body: "JWT, refresh tokens, role authorization, and protected routes." },
  { icon: BarChart3, title: "Analytics", body: "Admin and recruiter charts for jobs, applications, interviews, and hiring ratios." },
  { icon: Sparkles, title: "AI matching", body: "ATS score, skill matching, keyword checks, and candidate recommendations." },
  { icon: UsersRound, title: "Messaging", body: "Candidate and recruiter communication with notifications and read receipts." }
];

export function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3 font-bold">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>
            TalentFlow
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#jobs">Jobs</a>
            <a href="#features">Features</a>
            <a href="#roles">Roles</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="secondary">Sign in</Button></Link>
            <Link to="/register"><Button>Get started</Button></Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center">
        <div className="absolute inset-0 bg-slate-950/68" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl content-center gap-10 px-4 py-16 text-white lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div>
            <Badge className="bg-white/14 text-white ring-1 ring-white/20">Modern job portal management system</Badge>
            <h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-normal md:text-7xl">TalentFlow</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              Discover jobs, manage candidates, schedule interviews, and track hiring analytics from one polished portal for admins, recruiters, and job seekers.
            </p>
            <div className="mt-8 grid gap-3 rounded-lg bg-white p-3 shadow-soft md:grid-cols-[1fr_1fr_auto]">
              <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 text-slate-600">
                <Search className="h-4 w-4" />
                <input className="h-11 w-full outline-none" placeholder="Job title or skill" />
              </label>
              <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 text-slate-600">
                <MapPin className="h-4 w-4" />
                <input className="h-11 w-full outline-none" placeholder="Location" />
              </label>
              <Link to="/register"><Button className="h-12 w-full md:w-auto">Search jobs</Button></Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label}>
                  <p className="text-3xl font-bold">{value}</p>
                  <p className="text-sm text-slate-200">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="self-end rounded-lg border border-white/18 bg-white/12 p-4 backdrop-blur">
            <div className="rounded-lg bg-white p-4 text-slate-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Live hiring pipeline</p>
                  <h2 className="text-xl font-bold">Application Workflow</h2>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
              </div>
              <div className="mt-5 grid gap-3">
                {["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected"].map((stage, index) => (
                  <div key={stage} className="flex items-center gap-3 rounded-md border border-slate-200 p-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-sm font-bold text-primary">{index + 1}</span>
                    <span className="font-medium">{stage}</span>
                    <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="jobs" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Featured openings</p>
            <h2 className="mt-2 text-3xl font-bold">Browse real portal listings</h2>
          </div>
          <Link to="/register"><Button variant="secondary">View candidate portal <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <Card key={job.title}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{job.company} - {job.location}</p>
                </div>
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 font-semibold">{job.salary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}
              </div>
              <Link to="/register"><Button className="mt-5 w-full">Apply now</Button></Link>
            </Card>
          ))}
        </div>
      </section>

      <section id="features" className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 lg:grid-cols-4 lg:px-8">
          {featureCards.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="shadow-none">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="roles" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["Admin", "Manage users, recruiters, companies, skills, categories, reports, and platform analytics."],
            ["Recruiter", "Create companies and jobs, review applicants, schedule interviews, and manage hiring pipelines."],
            ["Job Seeker", "Build a profile, upload resumes, bookmark jobs, apply, and track application status."]
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-slate-200 bg-slate-900 p-6 text-white">
              <h3 className="text-2xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
