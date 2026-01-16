"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function enrollCourse(courseId: string, slug: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      courseId,
    },
  });

  redirect(`/courses/${slug}`);
}
