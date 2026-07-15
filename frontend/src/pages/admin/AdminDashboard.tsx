import { useEffect, useState } from "react";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { Activity, Briefcase, Calendar, CheckCircle2, ClipboardList, Users, UserCheck, UserRound } from "lucide-react";
import { api } from "../../lib/api";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { Card } from "../../components/ui/Card";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip);

const fallback = {
  totals: { totalUsers: 1284, totalRecruiters: 124, totalApplicants: 944, jobsPosted: 386, applicationsReceived: 8230, interviewsScheduled: 318, pendingReviews: 74, activeJobs: 182, inactiveJobs: 47 },
  monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({ month, applications: 180 + index * 42 })),
  activities: [{ title: "Recruiter approved", body: "Northstar Labs was approved." }],
  notifications: [{ title: "Hiring SLA", body: "Review response time improved by 12%." }]
};

export function AdminDashboard() {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setData(res.data)).catch(() => setData(fallback));
  }, []);
  const totals = data.totals;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Users" value={totals.totalUsers} icon={Users} />
        <MetricCard label="Recruiters" value={totals.totalRecruiters} icon={UserCheck} tone="from-teal-600 to-emerald-500" />
        <MetricCard label="Applicants" value={totals.totalApplicants} icon={UserRound} tone="from-fuchsia-600 to-pink-500" />
        <MetricCard label="Jobs Posted" value={totals.jobsPosted} icon={Briefcase} tone="from-amber-500 to-orange-500" />
        <MetricCard label="Applications" value={totals.applicationsReceived} icon={ClipboardList} />
        <MetricCard label="Interviews" value={totals.interviewsScheduled} icon={Calendar} tone="from-violet-600 to-indigo-500" />
        <MetricCard label="Pending Reviews" value={totals.pendingReviews} icon={Activity} tone="from-slate-700 to-slate-500" />
        <MetricCard label="Active Jobs" value={totals.activeJobs} icon={CheckCircle2} tone="from-lime-600 to-green-500" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_.8fr]">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Monthly Applications</h2>
          <Line data={{ labels: data.monthly.map((m) => m.month), datasets: [{ label: "Applications", data: data.monthly.map((m) => m.applications), borderColor: "#2563eb", backgroundColor: "#2563eb", tension: 0.35 }] }} />
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            {[...data.activities, ...data.notifications].slice(0, 6).map((item, index) => (
              <div key={index} className="rounded-md bg-slate-50 p-3 dark:bg-slate-950">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-slate-500">{item.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
