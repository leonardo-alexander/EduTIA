export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateJobPopover from "../jobs/CreateJob";
import { ApplicantsChart } from "./ApplicantsChart";
import { HiredPieChart } from "./HiredPieChart";
import { JobPostCard } from "../jobs/JobPostCard";

export default async function CompanyDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "COMPANY") {
    redirect("/dashboard");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      verification: true,
    },
  });

  if (!profile?.verification || profile.verification.status !== "VERIFIED") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">
            Company Not Verified
          </h1>
          <p className="text-slate-600">
            You must verify your company before posting jobs.
          </p>

          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-lg bg-eduBlue px-6 py-2 text-white font-medium hover:bg-blue-700"
          >
            Verify Company
          </Link>
        </div>
      </div>
    );
  }

  const jobs = await prisma.jobPosting.findMany({
    where: { userId: user.id },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
      applications: {
        select: {
          appliedAt: true,
          status: true,
        },
      },
    },
    orderBy: [
      {
        applications: {
          _count: "desc",
        },
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const jobCategories = await prisma.jobCategory.findMany({
    orderBy: { name: "asc" },
  });

  const totalApplicants = jobs.reduce(
    (sum, job) => sum + job._count.applications,
    0,
  );

  const hiredCount = jobs.reduce((sum, job) => sum + job.hired, 0);

  const pendingCount = jobs.reduce(
    (sum, job) =>
      sum +
      job.applications.filter(
        (app) => app.status === "APPLIED" || app.status === "REVIEWED"
      ).length,
    0
  );

  const acceptedCount = jobs.reduce(
    (sum, job) =>
      sum + job.applications.filter((app) => app.status === "ACCEPTED").length,
    0
  );

  const now = new Date();
  const weeklyData = [];
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekApplicants = jobs.reduce((sum, job) => {
      return (
        sum +
        job.applications.filter((app) => {
          const appDate = new Date(app.appliedAt);
          return appDate >= weekStart && appDate < weekEnd;
        }).length
      );
    }, 0);

    const weekLabel = weekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    weeklyData.push({
      week: weekLabel,
      applicants: weekApplicants,
    });
  }

  const jobsForCards = jobs.map((job) => {
    const pendingCount = job.applications.filter(
      (app) => app.status === "APPLIED" || app.status === "REVIEWED"
    ).length;

    const acceptedCount = job.applications.filter(
      (app) => app.status === "ACCEPTED"
    ).length;

    const { applications, ...rest } = job;
    return {
      ...rest,
      pendingCount,
      acceptedCount,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 min-h-screen">
      <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
        Company Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 flex">
          <ApplicantsChart data={weeklyData} />
        </div>

        <div className="lg:col-span-1 flex">
          <HiredPieChart hired={hiredCount} notHired={totalApplicants - hiredCount} />
        </div>
      </div>

      <div className="bg-slate-50 rounded-3xl border border-slate-200/60 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Job Posts</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              Showing: {jobs.length}
            </span>
            <span className="text-sm text-amber-600">
              Pending: {pendingCount}
            </span>
            <span className="text-sm text-green-600">
              Accepted: {acceptedCount}
            </span>
            <CreateJobPopover categories={jobCategories} />
          </div>
        </div>

        {jobsForCards.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {jobsForCards.map((job) => (
              <JobPostCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-slate-500">
            No job posts yet.
          </div>
        )}
      </div>
    </div>
  );
}