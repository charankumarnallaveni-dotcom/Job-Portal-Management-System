import { useEffect, useState } from "react";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Briefcase, ClipboardCheck, Mail, Users } from "lucide-react";
import { api } from "../../lib/api";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { Card } from "../../components/ui/Card";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function RecruiterDashboard() {
  const [funnel, setFunnel] = useState([{ status: "applied", count: 23 }, { status: "shortlisted", count: 8 }, { status: "selected", count: 3 }]);
  useEffect(() => {
    api.get("/recruiter/analytics").then((res) => setFunnel(res.data.funnel)).catch(() => undefined);
  }, []);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Open Jobs" value="18" icon={Briefcase} />
        <MetricCard label="Applicants" value="246" icon={Users} tone="from-teal-600 to-emerald-500" />
        <MetricCard label="Shortlisted" value="42" icon={ClipboardCheck} tone="from-violet-600 to-indigo-500" />
        <MetricCard label="Emails Sent" value="119" icon={Mail} tone="from-amber-500 to-orange-500" />
      </div>
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Hiring Funnel</h2>
        <Bar data={{ labels: funnel.map((item) => item.status.replaceAll("_", " ")), datasets: [{ label: "Candidates", data: funnel.map((item) => item.count), backgroundColor: ["#2563eb", "#0d9488", "#7c3aed", "#f59e0b", "#16a34a", "#dc2626"] }] }} />
      </Card>
    </div>
  );
}
