import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import UpdateJobPopover from "@/components/jobs/UpdateJob";
import DeleteJobButton from "@/components/jobs/DeleteJob";
import Link from "next/link";
import type { Metadata } from "next";
import BackButton from "@/components/BackButton";
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Briefcase,
  ArrowLeft,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Job Applicants | ${slug} | EduTIA`,
    description: "Manage and review applicants for your job posting.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function JobApplicantsPage({ params }: PageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  if (!user || user.role !== "COMPANY") redirect("/");
  const job = await prisma.jobPosting.findUnique({
    where: { slug },
    include: {
      category: true,
      user: {
        include: { profile: true },
      },
      applications: {
        include: {
          user: {
            include: { profile: true },
          },
        },
        orderBy: [{ status: "asc" }, { appliedAt: "desc" }],
      },
    },
  });

  if (!job || job.userId !== user.id) redirect("/dashboard");

  const jobCategories = await prisma.jobCategory.findMany({
    orderBy: { name: "asc" },
  });

  const acceptedCount = job.applications.filter(
    (app) => app.status === "ACCEPTED"
  ).length;
  const reviewedCount = job.applications.filter(
    (app) => app.status === "REVIEWED"
  ).length;
  const pendingCount = job.applications.filter(
    (app) => app.status === "APPLIED"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Accepted
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case "REVIEWED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex justify-between gap-6">
            <div>
              <BackButton />

              <div className="flex items-center gap-3 flex-wrap mb-4">
                <span className="bg-eduBlue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {job.category.name}
                </span>
                {job.status === "DRAFT" && (
                  <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Draft
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  {job.title}
                </h1>
                <p className="text-slate-400 max-w-2xl line-clamp-2">
                  {job.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <UpdateJobPopover job={job} categories={jobCategories} />
              <DeleteJobButton jobId={job.id} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-slate-100 rounded-xl">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {job.applications.length}
            </p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
              Total
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-amber-50 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
              Pending
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">{reviewedCount}</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
              Reviewing
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <UserCheck className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {acceptedCount}
            </p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
              Accepted
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Applicants</h2>
            <span className="text-sm text-slate-500">
              {job.applications.length} total
            </span>
          </div>

          {job.applications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                No applicants yet
              </h3>
              <p className="text-sm text-slate-400">
                Share your job posting to attract candidates
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {job.applications.map((app) => (
                <Link
                  key={app.id}
                  href={`/company/jobs/${job.slug}/applications/${app.id}`}
                  className="flex items-center justify-between gap-4 p-5 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-lg font-semibold text-slate-600 shrink-0">
                      {app.user.profile?.pictureUrl ? (
                        <img
                          src={app.user.profile.pictureUrl}
                          alt="Profile picture"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {app.user.profile?.name?.[0] ??
                            app.user.email[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 group-hover:text-eduBlue transition-colors truncate">
                        {app.user.profile?.name || app.user.email}
                      </p>
                      <p className="text-sm text-slate-500">
                        Applied{" "}
                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {getStatusBadge(app.status)}
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-eduBlue transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}