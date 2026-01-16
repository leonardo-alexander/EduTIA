"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function getNextCourseItem(courseId: string) {
  const user = await requireUser();

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
    },
  });
}
