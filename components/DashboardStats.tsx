import { BookOpen, CheckCircle, Clock, LucideIcon } from "lucide-react";

interface DashboardStatsProps {
  inProgressCount: number;
  completedCount: number;
  hoursSpent: number;
}

interface StatConfig {
  label: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export function DashboardStats({
  inProgressCount,
  completedCount,
  hoursSpent,
}: DashboardStatsProps) {
  const stats: StatConfig[] = [
    {
      label: "In Progress",
      value: inProgressCount,
      icon: BookOpen,
      colorClass: "text-eduBlue",
      bgClass: "bg-blue-100",
    },
    {
      label: "Completed",
      value: completedCount,
      icon: CheckCircle,
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-100",
    },
    {
      label: "Hours Spent",
      value: hoursSpent,
      icon: Clock,
      colorClass: "text-amber-600",
      bgClass: "bg-amber-100",
    },
  ];

  return (
    <aside className="flex flex-col gap-3 w-full">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1.5"
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center mb-0.5 ${stat.bgClass} ${stat.colorClass}`}
          >
            <stat.icon className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-slate-900">
            {stat.value}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {stat.label}
          </span>
        </div>
      ))}
    </aside>
  );
}
