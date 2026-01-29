export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CompanyDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "COMPANY") {
    redirect("/dashboard");
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
    orderBy: { createdAt: "desc" },
  });

  const totalApplicants = jobs.reduce(
    (sum, job) => sum + job._count.applications,
    0,
  );

  const hiredCount = jobs.reduce((sum, job) => sum + job.hired, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Company Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Jobs Posted" value={jobs.length} />
        <Stat label="Applicants" value={totalApplicants} />
        <Stat label="Hired" value={hiredCount} />
      </div>

      {/* Job List */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 font-semibold border-b shadow">Your Job Posts</div>
        <div className="divide-y">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-gray-500">
                  {job._count.applications} applicants
                </p>
              </div>

              <Link
                href={`/dashboard/company/jobs/${job.slug}`}
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
