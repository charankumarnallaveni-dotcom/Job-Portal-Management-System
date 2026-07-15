import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Application } from "../../types";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  useEffect(() => {
    api.get("/candidate/applications").then((res) => setApplications(res.data.data)).catch(() => setApplications([]));
  }, []);
  return (
    <Card>
      <h1 className="text-xl font-bold">My Applications</h1>
      <div className="mt-5 space-y-3">
        {(applications.length ? applications : [{ id: 1, title: "Senior Full Stack Engineer", company_name: "Northstar Labs", status: "shortlisted" }]).map((app) => (
          <div key={app.id} className="flex items-center justify-between rounded-md border border-slate-200 p-4 dark:border-slate-800">
            <div><p className="font-medium">{app.title}</p><p className="text-sm text-slate-500">{app.company_name}</p></div>
            <Badge>{app.status.replaceAll("_", " ")}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
