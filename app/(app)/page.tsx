import { Metadata } from "next";
import Homepage from "../../components/Homepage";
import { getCurrentUser } from "@/lib/auth";
import { mapCourseToUI } from "@/lib/mappers/course";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "EduTIA – Learn, Upskill, and Get Hired",
  description:
    "EduTIA helps you learn new skills, follow structured learning paths, and connect with job opportunities.",
  openGraph: {
    title: "EduTIA – Learn, Upskill, and Get Hired",
    description:
      "Learn new skills, follow curated learning paths, and connect with job opportunities on EduTIA.",
    type: "website",
  },
};

export default async function LandingPage() {
  const user = await getCurrentUser();
  const userId = user?.id;

  const topCourses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: [{ avgRating: "desc" }, { reviewCount: "desc" }, { title: "asc" }],
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      level: true,
      duration: true,
      thumbnailUrl: true,
      avgRating: true,
      reviewCount: true,
      category: {
        select: { id: true, name: true, slug: true },
      },
      favorites: userId
        ? {
            where: { userId },
            select: { userId: true },
          }
        : false,
    },
  });

  return (
    <Homepage
      topCourses={topCourses.map((course) => mapCourseToUI(course, { userId }))}
      isAuthenticated={!!user}
    />
  );
}
