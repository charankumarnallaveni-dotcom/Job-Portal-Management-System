import { LucideIcon } from "lucide-react";
import { Card } from "../ui/Card";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: string;
};

export function MetricCard({ label, value, icon: Icon, tone = "from-blue-600 to-cyan-500" }: Props) {
  return (
    <Card className="overflow-hidden p-0">
      <div className={`bg-gradient-to-br ${tone} p-5 text-white`}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white/85">{label}</p>
          <Icon className="h-5 w-5" />
        </div>
        <p className="mt-4 text-3xl font-bold tracking-normal">{value}</p>
      </div>
    </Card>
  );
}
