"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function getNextCourseItem(courseId: string) {
  const user = await getCurrentUser();

  if (!user) return null;

  return await prisma.courseItem.findFirst({
    where: {
      courseId,
      OR: [
        {
          type: "MODULE",
          module: {
            progresses: {
              none: { userId: user.id },
            },
          },
        },
        {
          type: "WORKSHOP",
          workshop: {
            submissions: {
              none: { userId: user.id },
            },
          },
        },
      ],
    },
    orderBy: { position: "asc" },
    select: {
      id: true,
      slug: true,
    },
  });
}

export async function getNextPathCourseSlug(
  pathId: string,
): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const nextCourse = await prisma.learningPathItem.findFirst({
    where: {
      learningPathId: pathId,
      course: {
        isPublished: true,
        enrollments: {
          none: {
            userId: user.id,
            status: "COMPLETED",
          },
        },
      },
    },
    orderBy: { position: "asc" },
    select: {
      course: {
        select: {
          slug: true,
        },
      },
    },
  });

  return nextCourse?.course.slug ?? null;
}
