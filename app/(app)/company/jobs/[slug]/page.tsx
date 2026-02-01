import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import UpdateJobPopover from "@/components/jobs/UpdateJob";
import DeleteJobButton from "@/components/jobs/DeleteJob";
import { AppActions } from "@/components/jobs/AppActions";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
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
        orderBy: {
          appliedAt: "desc",
        },
      },
    },
  });

  if (!job || job.userId !== user.id) redirect("/dashboard");

  const jobCategories = await prisma.jobCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-sm text-gray-500">
            {job.applications.length} applicants
          </p>
        </div>

        <div className="flex gap-2">
          <UpdateJobPopover job={job} categories={jobCategories} />
          <DeleteJobButton jobId={job.id} />
        </div>
      </div>

      {job.applications.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No one has applied yet.
        </div>
      )}

      <div className="space-y-4">
        {job.applications.map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm hover:shadow transition"
          >
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
                {app.user.profile?.name?.[0] ?? app.user.email[0].toUpperCase()}
              </span>
              <div>
                <p className="font-semibold">
                  {app.user.profile?.name || app.user.email}
                </p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      app.status === "ACCEPTED"
                        ? "text-green-600"
                        : app.status === "REJECTED"
                          ? "text-red-500"
                          : "text-yellow-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </p>
              </div>
            </div>
            <Link href={`/company/jobs/${job.slug}/applications/${app.id}`}>
              View application detail
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
