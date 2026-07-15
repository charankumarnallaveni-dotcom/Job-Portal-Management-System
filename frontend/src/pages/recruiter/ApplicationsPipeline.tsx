import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Application } from "../../types";
import { StatusPipeline } from "../../components/dashboard/StatusPipeline";
import { Card } from "../../components/ui/Card";

export function ApplicationsPipeline() {
  const [applications, setApplications] = useState<Application[]>([]);
  useEffect(() => {
    api.get("/recruiter/applications").then((res) => setApplications(res.data.data)).catch(() => {
      setApplications([
        { id: 1, candidate_name: "Casey Candidate", job_title: "Senior Full Stack Engineer", status: "shortlisted", ats_score: 88 },
        { id: 2, candidate_name: "Jordan Lee", job_title: "Frontend Architect", status: "under_review", ats_score: 81 }
      ]);
    });
  }, []);
  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold">Application Pipeline</h1>
        <p className="mt-1 text-sm text-slate-500">Recruiters can move candidates through applied, review, shortlist, interview, selected, and rejected stages through the API.</p>
      </Card>
      <StatusPipeline applications={applications} />
    </div>
  );
}
