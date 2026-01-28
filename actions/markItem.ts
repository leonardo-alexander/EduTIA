import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export async function handleMark(courseItemId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const courseItem = await prisma.courseItem.findUnique({
    where: { id: courseItemId },
  });

  if (!courseItem) notFound();

  if (courseItem.type === "MODULE") {
    if (!courseItem.moduleId) notFound();

    const progress = await prisma.moduleProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: courseItem.moduleId,
        },
      },
    });

    
  }
}
