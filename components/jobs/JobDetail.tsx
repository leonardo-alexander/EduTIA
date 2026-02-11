"use client";

import Link from "next/link";
import {
  Briefcase,
  MapPin,
  CheckCircle,
  Send,
  Clock,
  Banknote,
  Globe,
  Building2,
  Users,
  UserCheck,
  Info,
  Layers,
  Timer,
  FileText,
} from "lucide-react";
import { JobUI } from "@/types/job.ui";
import { ApplicationStatus, User, Profile } from "@prisma/client";
import BackButton from "../BackButton";
import { applyJob } from "@/actions/applyJob";

interface JobDetailsProps {
  job: JobUI;
  applicationStatus: ApplicationStatus | null;
  user: User | null;
  profile: Profile | null;
}

export default function JobDetail({
  job,
  applicationStatus,
  user,
  profile,
}: JobDetailsProps) {
  const renderApplyButton = () => {
    if (!user) {
      return (
        <Link
          href="/login"
          className="w-full block text-center bg-eduBlue text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
        >
          Login to Apply
        </Link>
      );
    }

    if (user.role !== "EDUCATEE") return null;

    if (
      !profile ||
      !profile.name ||
      !profile.gender ||
      !profile.dob
    ) {
      return (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-medium text-center">
          Complete your profile to apply
        </p>
      );
    }

    return (
      <form action={applyJob.bind(null, job.id)}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-eduBlue hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-sm hover:shadow-md"
        >
          <Send className="w-5 h-5" />
          Apply Now
        </button>
      </form>
    );
  };

  const renderStatusCard = () => {
    if (!user || user.role !== "EDUCATEE") return null;

    let statusContent = null;

    switch (applicationStatus) {
      case "APPLIED":
        statusContent = (
          <div className="flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 py-3 rounded-xl font-semibold border border-emerald-200">
            <CheckCircle className="w-5 h-5" />
            Applied
          </div>
        );
        break;
      case "REVIEWED":
        statusContent = (
          <div className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-3 rounded-xl font-semibold border border-blue-200">
            <Clock className="w-5 h-5" />
            Under Review
          </div>
        );
        break;
      case "ACCEPTED":
        statusContent = (
          <div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 py-3 rounded-xl font-semibold border border-green-200">
            <CheckCircle className="w-5 h-5" />
            Accepted
          </div>
        );
        break;
      case "REJECTED":
        statusContent = (
          <div className="flex items-center justify-center gap-2 bg-red-100 text-red-700 py-3 rounded-xl font-semibold border border-red-200">
            Rejected
          </div>
        );
        break;
      default:
        return null;
    }

    return (
      <div className="mt-6 bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-900/5 p-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Application Status
        </h3>
        {statusContent}
      </div>
    );
  };

  const formatPaycheck = (min: number | null, max: number | null) => {
    if (!min && !max) return "Undisclosed";

    const format = (num: number) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 1,
        notation: "compact",
      }).format(num);

    if (min && max) return `${format(min)} - ${format(max)}`;
    if (min) return `From ${format(min)}`;
    if (max) return `Up to ${format(max)}`;
    return "";
  };

  const hireRate =
    ((job.user.profile?.totalHired ?? 0) /
      Math.max(job.user.profile?.totalApplicants ?? 1, 1)) *
    100;

  const websiteUrl = job.user.profile?.companyWebsite
    ? job.user.profile.companyWebsite.startsWith("http")
      ? job.user.profile.companyWebsite
      : `https://${job.user.profile.companyWebsite}`
    : "#";

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-slate-900 text-white border-b border-slate-800 relative z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-11.25">
          <BackButton />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <span className="bg-eduBlue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {job.category.name}
                </span>
              </div>

              <h1 className="text-4xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
                {job.title}
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl whitespace-pre-line">
                {job.description}
              </p>
            </div>
            <div className="lg:col-span-1 hidden lg:block"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 lg:order-last relative lg:pb-12">
            <div className="relative lg:-mt-48 z-10 lg:sticky top-24 self-start">
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
                <div className="p-6 flex flex-col gap-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    Information
                  </h3>

                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl">
                        <MapPin className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                          Location
                        </p>
                        <p className="text-lg font-semibold text-slate-900 capitalize">
                          {job.location ??
                            job.user.profile?.companyAddress ??
                            "Job Location"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl">
                        <Layers className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                          Level
                        </p>
                        <p className="text-lg font-semibold text-slate-900 capitalize">
                          {job.level?.toLowerCase() || "Any"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl">
                        <Timer className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                          Type
                        </p>
                        <p className="text-lg font-semibold text-slate-900 capitalize">
                          {job.type.replace("_", " ").toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl">
                        <Building2 className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                          Work Mode
                        </p>
                        <p className="text-lg font-semibold text-slate-900 capitalize">
                          {job.workMode.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl">
                        <Banknote className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                          Salary
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatPaycheck(job.paycheckMin, job.paycheckMax)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-200/60">
                    {!applicationStatus && renderApplyButton()}
                  </div>
                </div>
              </div>

              {renderStatusCard()}
            </div>
          </div>

          <div className="lg:col-span-2 py-12 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex gap-4 items-start">
                  <div className="w-16 h-16 shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-2 flex items-center justify-center">
                    <img
                      src={job.user.profile?.pictureUrl || "/avatars/male.svg"}
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-slate-900">
                      {job.user.profile?.name || "Company Name"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <p className="text-slate-500 text-sm flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {job.user.profile?.companyAddress || "Address"}
                      </p>
                      {job.user.profile?.companyWebsite && (
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-eduBlue hover:text-blue-700 transition-colors text-sm"
                        >
                          <Globe className="w-4 h-4" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {job.user.profile?.bio || "No company bio available."}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-center">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                      Jobs Posted
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {job.user.profile?.totalJobs || 0}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-center">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                      Hire Rate
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {Math.round(hireRate) || 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
                <p className="text-sm font-semibold text-slate-600 mb-3">
                  Applicants
                </p>
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {job.applicators}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
                <p className="text-sm font-semibold text-slate-600 mb-3">
                  Hired
                </p>
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <UserCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-emerald-600">
                  {job.hired}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}