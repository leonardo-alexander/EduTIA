import Link from "next/link";
import { JobUI } from "@/types/job.ui";
import { JobType, WorkMode } from "@prisma/client";

export default function JobCard({
  job,
  isAuthenticated,
}: {
  job: JobUI;
  isAuthenticated: boolean;
}) {
  const JOB_TYPE_LABELS: Record<JobType, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    FREELANCE: "Freelance",
    INTERNSHIP: "Internship",
  };

  const WORK_MODE_LABELS: Record<WorkMode, string> = {
    ONSITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
  };

  const JOB_TYPE_STYLES: Record<JobType, string> = {
    FULL_TIME: "bg-emerald-100 text-emerald-700",
    PART_TIME: "bg-blue-100 text-blue-700",
    CONTRACT: "bg-amber-100 text-amber-700",
    FREELANCE: "bg-purple-100 text-purple-700",
    INTERNSHIP: "bg-pink-100 text-pink-700",
  };

  const WORK_MODE_STYLES: Record<WorkMode, string> = {
    ONSITE: "bg-slate-100 text-slate-700",
    REMOTE: "bg-green-100 text-green-700",
    HYBRID: "bg-indigo-100 text-indigo-700",
  };

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-lg shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-1 transition-all duration-300 flex h-full cursor-pointer"
    >
      <div className="relative h-full overflow-hidden">
        <img
          src={job.user.profile?.pictureUrl || "/avatars/male.svg"}
          alt={job.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          {job.category.name}
        </span>
      </div>

      <div className="p-6 flex flex-col h-full">
        <div>
          <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-eduBlue transition-colors line-clamp-2">
            {job.title}
          </h3>

          <p className="text-black text-sm leading-relaxed">
            {job.user.profile?.companyName} <br />
            {job.user.profile?.companyAddress}
          </p>

          <p className="text-slate-600 text-sm leading-relaxed grow">
            {job.description}
          </p>
        </div>
        <div className="mt-auto">
          <div>
            <p className="text-black text-sm font-semibold">
              Salary Expectation:
            </p>
            <p className="text-sm font-semibold text-emerald-700">
              Rp{job.salaryMin} – Rp{job.salaryMax} IDR
            </p>
          </div>

          <div className="mt-3">
            <p className="text-sm font-semibold text-black">Tags:</p>

            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${JOB_TYPE_STYLES[job.type]}`}
              >
                {JOB_TYPE_LABELS[job.type]}
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${WORK_MODE_STYLES[job.workMode]}`}
              >
                {WORK_MODE_LABELS[job.workMode]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
