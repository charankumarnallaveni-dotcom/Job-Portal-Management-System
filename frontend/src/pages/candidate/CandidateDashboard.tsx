import { useEffect, useState } from "react";
import { Bookmark, CalendarDays, FileText, Sparkles } from "lucide-react";
import { api } from "../../lib/api";
import { Job } from "../../types";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export function CandidateDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    api.get("/candidate/recommendations").then((res) => setJobs(res.data.data)).catch(() => setJobs([]));
  }, []);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Applications" value="12" icon={FileText} />
        <MetricCard label="Bookmarks" value="7" icon={Bookmark} tone="from-teal-600 to-emerald-500" />
        <MetricCard label="Interviews" value="3" icon={CalendarDays} tone="from-violet-600 to-indigo-500" />
        <MetricCard label="ATS Score" value="88%" icon={Sparkles} tone="from-amber-500 to-orange-500" />
      </div>
      <Card>
        <h2 className="text-lg font-semibold">Recommended Jobs</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(jobs.length ? jobs : [{ id: 1, title: "Senior Full Stack Engineer", company_name: "Northstar Labs", location: "Remote", job_type: "full_time", work_mode: "remote", skills: "React,TypeScript,Node.js", status: "active" }]).map((job) => (
            <div key={job.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-semibold">{job.title}</p>
              <p className="text-sm text-slate-500">{job.company_name} • {job.location}</p>
              <div className="mt-3 flex flex-wrap gap-2">{job.skills.split(",").map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
