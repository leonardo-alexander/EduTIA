import Jobs from "@/components/jobs/Jobs";
import { getCurrentUser } from "@/lib/auth";
import { getJobs } from "@/lib/data/jobs";
import { prisma } from "@/lib/prisma";
import { JobUI } from "@/types/job.ui";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;

  const category = typeof params.category === "string" ? params.category : null;

  const title = category ? `${category} Jobs | EduTIA` : "Jobs | EduTIA";

  const description = category
    ? `Browse ${category} job opportunities on EduTIA.`
    : "Browse job opportunities on EduTIA and apply today.";

  return {
    title,
    description,
  };
}

export default async function JobsPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value) {
      params.set(key, value);
    }
  }

  const categories = await prisma.jobCategory.findMany();
  const jobs: JobUI[] = await getJobs(params);

  return <Jobs jobs={jobs} categories={categories} isAuthenticated={!!user} />;
}
