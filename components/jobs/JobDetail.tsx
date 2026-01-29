"use client";

import Link from "next/link";
import {
  Briefcase,
  MapPin,
  CheckCircle,
  Send,
  Clock,
  Bookmark,
  ArrowUpDown,
  Banknote,
} from "lucide-react";
import { JobUI } from "@/types/job.ui";
import { ApplicationStatus } from "@prisma/client";
import BackButton from "../BackButton";

interface JobDetailsProps {
  job: JobUI;
  applicationStatus: ApplicationStatus | null;
  isAuthenticated: boolean;
}

export default function JobDetail({
  job,
  applicationStatus,
  isAuthenticated,
}: JobDetailsProps) {
  const renderApplyButton = () => {
    if (!isAuthenticated) {
      return (
        <Link
          href="/login"
          className="w-full block text-center bg-eduBlue text-white py-3 rounded-lg font-semibold"
        >
          Login to Apply
        </Link>
      );
    }

    switch (applicationStatus) {
      case "APPLIED":
        return (
          <div className="flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 py-3 rounded-lg font-semibold">
            <CheckCircle className="w-5 h-5" />
            Applied
          </div>
        );

      case "REVIEWED":
        return (
          <div className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-3 rounded-lg font-semibold">
            <CheckCircle className="w-5 h-5" />
            Under Review
          </div>
        );

      case "ACCEPTED":
        return (
          <div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 py-3 rounded-lg font-semibold">
            Accepted
          </div>
        );

      case "REJECTED":
        return (
          <div className="flex items-center justify-center gap-2 bg-red-100 text-red-700 py-3 rounded-lg font-semibold">
            Rejected
          </div>
        );

      default:
        return (
          <form action={`/jobs/${job.slug}/apply`} method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-eduBlue hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              <Send className="w-5 h-5" />
              Apply Now
            </button>
          </form>
        );
    }
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="space-y-4 flex flex-col">
            <BackButton />
            <span className="bg-eduBlue px-4 py-1 rounded-full text-xs font-bold uppercase w-fit">
              {job.category.name}
            </span>
            <h1 className="text-4xl font-extrabold">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {job.location?.toUpperCase() ??
                  job.user.profile?.companyAddress?.toUpperCase() ??
                  "JOB LOCATION"}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {job.level || "ANY"}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {job.type.replace("_", " ")}
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                {job.workMode}
              </div>
            </div>
            <div className="text-sm text-slate-300 flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              {formatPaycheck(job.paycheckMin, job.paycheckMax)}
            </div>
            <div className="text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last Updated:{" "}
                {new Date(job.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-bold mb-4">Job Description</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </section>

          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-bold mb-4">Company Profile</h2>
            <div className="flex gap-3">
              <img
                src={job.user.profile?.pictureUrl || "/avatars/male.svg"}
                alt="Company Logo"
                className="h-20 w-20"
              />
              <div>
                <p className="text-black">
                  {job.user.profile?.name || "Company Name"}
                </p>
                <p className="text-slate-700">
                  {job.user.profile?.companyAddress || "Company Address"}
                </p>
                <p className="text-slate-700">
                  {job.user.profile?.companyWebsite ? (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-eduBlue hover:text-blue-700 transition-colors"
                    >
                      {job.user.profile.companyWebsite}
                      <svg
                        className="w-3 h-3 opacity-60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : null}
                </p>
              </div>
            </div>
            <div className="flex">
              <p className="text-slate-700 w-[50%] p-2">
                {job.user.profile?.bio || "Bio"}
              </p>
              <div className="w-[50%] p-2 border-l">
                <p className="text-black">
                  Jobs posted: {job.user.profile?.totalJobs || 0}
                </p>
                <p className="text-slate-700 text-sm">
                  {hireRate || 0}% hire rate
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Viewers</span>
              <span className="font-semibold">{job.views}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Applicants</span>
              <span className="font-semibold">{job.applicators}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Hired</span>
              <span className="font-semibold">{job.hired}</span>
            </div>

            <div className="pt-4 border-t flex flex-col gap-3">
              {renderApplyButton()}
              <form action={`/jobs/${job.slug}/apply`} method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 text-eduBlue hover:text-eduBlue/80 py-3 rounded-lg font-semibold"
                >
                  {/* <Bookmark className="w-5 h-5" />
                  Save Job */}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 space-y-3">
            <h3 className="font-bold text-slate-900">Job Info</h3>

            <div className="flex justify-between text-sm">
              <span>Location</span>
              <span className="capitalize">
                {job.location ??
                  job.user.profile?.companyAddress ??
                  "Job Location"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Level</span>
              <span className="capitalize">
                {job.level?.toLowerCase() || "Any"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Type</span>
              <span className="capitalize">
                {job.type.replace("_", " ").toLowerCase()}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Work Mode</span>
              <span className="capitalize">{job.workMode.toLowerCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
