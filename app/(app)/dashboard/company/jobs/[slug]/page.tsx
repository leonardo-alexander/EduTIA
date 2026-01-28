import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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
      applications: {
        include: {
          user: {
            include: { profile: true },
          },
        },
      },
    },
  });

  if (!job || job.userId !== user.id) redirect("/dashboard");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{job.title}</h1>

      <div className="mt-6 space-y-4">
        {job.applications.map((app) => (
          <div key={app.id} className="border p-4 rounded flex justify-between">
            <div>
              <p className="font-medium">
                {app.user.profile?.name || app.user.email}
              </p>
              <p className="text-sm text-gray-500">Status: {app.status}</p>
            </div>

            <div className="flex gap-2">
              <form action={`/api/applications/${app.id}/accept`} method="POST">
                <button className="btn-green">Accept</button>
              </form>
              <form action={`/api/applications/${app.id}/reject`} method="POST">
                <button className="btn-red">Reject</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
