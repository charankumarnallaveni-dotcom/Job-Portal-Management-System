import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { api } from "../lib/api";
import { currency } from "../lib/utils";
import { useDebounce } from "../hooks/useDebounce";
import { Job } from "../types";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const fallbackJobs: Job[] = [
  { id: 1, title: "Senior Full Stack Engineer", company_name: "Northstar Labs", location: "Remote", salary_min: 120000, salary_max: 170000, job_type: "full_time", work_mode: "remote", skills: "React,TypeScript,Node.js,MySQL", status: "active" },
  { id: 2, title: "Product Designer", company_name: "Atlas Cloud", location: "New York", salary_min: 95000, salary_max: 130000, job_type: "full_time", work_mode: "hybrid", skills: "Figma,Research,Systems", status: "active" },
  { id: 3, title: "Data Platform Engineer", company_name: "SignalWorks", location: "Austin", salary_min: 130000, salary_max: 180000, job_type: "full_time", work_mode: "onsite", skills: "Python,MySQL,AWS,Docker", status: "active" }
];

export function Jobs() {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>(fallbackJobs);
  const debouncedQ = useDebounce(q);
  const debouncedLocation = useDebounce(location);

  useEffect(() => {
    api.get("/jobs", { params: { q: debouncedQ, location: debouncedLocation } })
      .then((res) => setJobs(res.data.data))
      .catch(() => setJobs(fallbackJobs));
  }, [debouncedQ, debouncedLocation]);

  async function apply(jobId: number) {
    await api.post(`/candidate/jobs/${jobId}/apply`, { coverLetter: "I am interested in this role." });
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_260px_auto]">
          <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input className="pl-9" placeholder="Search title, company, or skill" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <Button>Search Jobs</Button>
        </div>
      </Card>
      <div className="grid gap-4 xl:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{job.title}</h2>
                <p className="text-sm text-slate-500">{job.company_name} - {job.location}</p>
              </div>
              <Badge>{job.work_mode}</Badge>
            </div>
            <p className="mt-4 text-sm font-semibold">{currency(job.salary_min)} - {currency(job.salary_max)}</p>
            <div className="mt-4 flex flex-wrap gap-2">{job.skills.split(",").map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
            <Button className="mt-5 w-full" onClick={() => apply(job.id)}>Apply</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
