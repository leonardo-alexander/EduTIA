import JobDetail from "@/components/jobs/JobDetail";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const job = await prisma.jobPosting.findUnique({
    where: { slug },
    include: {
      category: true,
      user: { include: { profile: true } },
    },
  });

  if (!job) notFound();

  const application = user
    ? await prisma.jobApplication.findUnique({
        where: {
          userId_jobId: {
            userId: user.id,
            jobId: job.id,
          },
        },
      })
    : null;

  return (
    <JobDetail
      job={job}
      applicationStatus={application?.status ?? null}
      isAuthenticated={!!user}
    />
  );
}
