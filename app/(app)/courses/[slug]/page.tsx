import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import CourseDetails from "@/components/CourseDetails";
import { CourseDetailUI } from "@/types/course-ui";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!course) {
    return { title: "Course Not Found" };
  }
  return {
    title: `${course.title} | Learning Platform`,
    description: course.description,
  };
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      items: {
        orderBy: { position: "asc" },
        include: {
          module: true,
          workshop: true,
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) notFound();

  const courseDetails: CourseDetailUI = {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    level: course.level,
    duration: course.duration,
    thumbnailUrl: course.thumbnailUrl,
    avgRating: course.avgRating,
    reviewCount: course.reviewCount,
    updatedAt: course.updatedAt,

    category: {
      id: course.category.id,
      name: course.category.name,
      slug: course.category.slug,
    },

    enrollmentCount: course._count.enrollments,
    items: course.items.map((item) => ({
      id: item.id,
      type: item.type,
      position: item.position,
      title: item.module?.title ?? item.workshop?.title ?? "Untitled Item",
    })),
  };

  const enrollment = user
    ? await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      })
    : null;

  return (
    <CourseDetails
      course={courseDetails}
      isEnrolled={!!enrollment}
      currentUserId={user?.id}
    />
  );
}
