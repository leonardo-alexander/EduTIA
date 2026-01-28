import Link from "next/link";
import { JobUI, TYPE_LABELS } from "@/types/job.ui";
import {
  Building2,
  MapPin,
  Banknote,
  Clock,
  Briefcase,
  ArrowUpDown,
} from "lucide-react";

export default function JobCard({
  job,
}: {
  job: JobUI;
  isAuthenticated: boolean;
}) {
  const formatPaycheck = (paycheck: number | null) => {
    if (!paycheck) return "Undisclosed";

    const format = (num: number) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 1,
        notation: "compact",
      }).format(num);

    if (paycheck) return `${format(paycheck)}`;
    return "";
  };

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-0.5"
    >
      <div className="flex gap-4 items-center">
        <div className="shrink-0">
          <div className="w-14 h-14 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center">
            <img
              src={job.user.profile?.pictureUrl || "/avatars/male.svg"}
              alt={job.user.profile?.name || "Company Logo"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="block text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors truncate">
            {job.title}
          </p>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium mt-1">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">
              {job.user.profile?.name || "Unknown Company"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 grow">
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100">
          {job.paycheck && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100/50">
              <Banknote className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">
                {formatPaycheck(job.paycheck)}
              </span>
            </div>
          )}

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium capitalize">
              {job.user.profile?.companyAddress
                ? job.user.profile.companyAddress
                : job.workMode.toLowerCase()}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium capitalize">
              {job.level?.toLowerCase() ?? "any"}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium">{TYPE_LABELS[job.type]}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium capitalize">
              {job.workMode.toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
