import { prisma } from "@/lib/prisma";
import Courses from "@/components/Courses";

export const dynamic = "force-dynamic";

export default async function Page() {
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return <Courses courses={courses} categories={categories} />;
}
