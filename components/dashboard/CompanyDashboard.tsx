export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateJobPopover from "../jobs/CreateJob";

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
      <div className="max-w-3xl mx-auto mt-16 text-center space-y-4 min-h-screen">
        <h1 className="text-2xl font-bold">Company Not Verified</h1>
        <p className="text-gray-600">
          You must verify your company before posting jobs.
        </p>

        <Link
          href="/profile"
          className="inline-block px-6 py-2 rounded-md bg-blue-600 text-white"
        >
          Verify Company
        </Link>
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Company Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <Stat label="Jobs Posted" value={jobs.length} />
        <Stat label="Applicants" value={totalApplicants} />
        <Stat label="Hired" value={hiredCount} />
      </div>

      <div className="bg-white rounded-xl border">
        <div className="p-4 font-semibold border-b shadow flex justify-between items-center">
          <p>Your Job Posts</p>
          <CreateJobPopover categories={jobCategories} />
        </div>
        <div className="divide-y">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {job.title}{" "}
                  <span className="text-gray-500">
                    {job.status === "DRAFT" && "| DRAFT"}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  {job._count.applications} applicants
                </p>
              </div>

              <Link
                href={`/company/jobs/${job.slug}`}
                className="text-blue-600 text-sm font-medium"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
