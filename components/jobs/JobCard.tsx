import Link from "next/link";
import { JobUI } from "@/types/job.ui";
import { ExperienceLevel, JobType, WorkMode } from "@prisma/client";
import {
  Building2,
  MapPin,
  Banknote,
  Clock,
  Briefcase,
  ArrowUpDown,
} from "lucide-react";

const WORK_MODE_LABELS: Record<WorkMode, string> = {
  ONSITE: "On-site",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
};

const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  JUNIOR: "Junior",
  MID: "Mid",
  SENIOR: "Senior",
  LEAD: "Lead",
};

export default function JobCard({
  job,
}: {
  job: JobUI;
  isAuthenticated: boolean;
}) {
  const formatSalary = (amount: number | null) => {
    if (!amount) return "Undisclosed";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(amount);
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-0.5">
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
          <Link
            href={`/jobs/${job.slug}`}
            className="block text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate"
          >
            {job.title}
          </Link>
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

        <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-slate-100">
          {job.paycheckMin && job.paycheckMax && (
            <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100/50">
              <Banknote className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold whitespace-nowrap">
                {formatSalary(job.paycheckMin)} -{" "}
                {formatSalary(job.paycheckMax)}
              </span>
            </div>
          )}

          <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium whitespace-nowrap">
              {job.location ?? job.user.profile?.companyAddress ?? "Address"}
            </span>
          </div>

          <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium whitespace-nowrap capitalize">
              {job.level?.toLowerCase() ?? "Any"}
            </span>
          </div>

          <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium whitespace-nowrap capitalize">
              {job.type.replace("_", " ").toLowerCase()}
            </span>
          </div>

          <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium whitespace-nowrap capitalize">
              {job.workMode.toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
