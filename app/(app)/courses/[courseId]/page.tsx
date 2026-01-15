import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import CourseDetails from "@/components/CourseDetails";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
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
  const { courseId } = await params;
  const user = await getCurrentUser();

  // fetch course data
  const course = await prisma.course.findUnique({
    where: { id: courseId },
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
        select: {
          enrollments: true,
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // user enrollment check
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

  // component render
  return (
    <CourseDetails
      course={course}
      isEnrolled={!!enrollment}
      currentUserId={user?.id}
    />
  );
}
