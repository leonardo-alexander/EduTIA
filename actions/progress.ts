import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function getCourseProgress(courseId: string) {
  const user = await requireUser();

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: user.id, courseId },
  });

  if (!enrollment) return 0;

  return enrollment.progressPercent;
}
