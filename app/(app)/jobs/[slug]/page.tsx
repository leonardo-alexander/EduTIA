import JobDetail from "@/components/jobs/JobDetail";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const job = await prisma.jobPosting.findUnique({
    where: { slug },
    select: {
      title: true,
      category: { select: { name: true } },
      user: { select: { profile: { select: { name: true } } } },
    },
  });

  if (!job) {
    return {
      title: "Job Not Found | EduTIA",
      robots: { index: false, follow: false },
    };
  }

  const companyName = job.user.profile?.name ?? "Company";

  return {
    title: `${job.title} at ${companyName} | EduTIA`,
    description: `Apply for the ${job.title} position at ${companyName}. Browse job opportunities on EduTIA.`,
    openGraph: {
      title: `${job.title} at ${companyName}`,
      description: `Apply for the ${job.title} position at ${companyName}.`,
      type: "website",
    },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
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
      user={user}
      profile={user?.profile || null}
    />
  );
}
