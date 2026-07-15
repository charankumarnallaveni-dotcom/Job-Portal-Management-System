import { motion } from "framer-motion";
import { Application } from "../../types";
import { Badge } from "../ui/Badge";

const stages = ["applied", "under_review", "shortlisted", "interview_scheduled", "selected", "rejected"];

export function StatusPipeline({ applications }: { applications: Application[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-6">
      {stages.map((stage) => (
        <div key={stage} className="min-h-56 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold capitalize">{stage.replaceAll("_", " ")}</h3>
            <Badge>{applications.filter((app) => app.status === stage).length}</Badge>
          </div>
          <div className="space-y-2">
            {applications.filter((app) => app.status === stage).map((app) => (
              <motion.div layout key={app.id} className="rounded-md border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="font-medium">{app.candidate_name || app.title}</p>
                <p className="mt-1 text-xs text-slate-500">{app.job_title || app.company_name}</p>
                {app.ats_score ? <Badge className="mt-2 bg-emerald-100 text-emerald-700">{app.ats_score}% match</Badge> : null}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
