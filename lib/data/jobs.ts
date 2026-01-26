import { JobUI } from "@/types/job.ui";
import { prisma } from "../prisma";
import { JobType, Prisma, WorkMode } from "@prisma/client";

export async function getJobs(
  params: URLSearchParams = new URLSearchParams(),
  userId?: string,
): Promise<JobUI[]> {
  const categories = params.getAll("category");
  const types = params.getAll("type") as JobType[];
  const modes = params.getAll("mode") as WorkMode[];
  const min = params.get("min") ? Number(params.get("min")) : undefined;
  const max = params.get("max") ? Number(params.get("max")) : undefined;
  const sort = params.get("sort");

  // let orderBy

  const and: Prisma.JobPostingWhereInput[] = [];

  if (categories.length) {
    and.push({
      category: {
        slug: {
          in: categories,
        },
      },
    });
  }

  if (types.length) {
    and.push({
      type: {
        in: types,
      },
    });
  }

  if (modes.length) {
    and.push({
      workMode: {
        in: modes,
      },
    });
  }

  if (min) {
    and.push({
      salaryMax: { gte: min },
    });
  }

  if (max) {
    and.push({
      salaryMin: { lte: max },
    });
  }

  return await prisma.jobPosting.findMany({
    where: {
      status: "PUBLISHED",
      AND: and.length ? and : undefined,
    },
    include: {
      category: true,
      user: {
        include: { profile: true },
      },
    },
  });
}
