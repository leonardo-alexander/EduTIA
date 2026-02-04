import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import CourseDetails from "@/components/CourseDetail";
import { CourseDetailUI } from "@/types/course.ui";
import { getNextCourseItem } from "@/actions/resume";

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
    select: {
      title: true,
      description: true,
      thumbnailUrl: true,
    },
  });

  if (!course) {
    return {
      title: "Course Not Found | EduTIA",
      robots: { index: false, follow: false },
    };
  }

  const description =
    course.description ||
    "Explore this course on EduTIA and start learning today.";

  return {
    title: `${course.title} | EduTIA`,
    description,
    openGraph: {
      title: course.title,
      description,
      images: course.thumbnailUrl ? [{ url: course.thumbnailUrl }] : undefined,
      type: "website",
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      items: {
        orderBy: { position: "asc" },
        include: {
          module: {
            include: {
              progresses: user
                ? {
                    where: { userId: user.id },
                    select: { completedAt: true },
                  }
                : false,
            },
          },
          workshop: {
            include: {
              submissions: user
                ? {
                    where: { userId: user.id },
                    select: { score: true },
                  }
                : false,
            },
          },
        },
      },
      _count: {
        select: { enrollments: true },
      },
      favorites: user ? { where: { userId: user.id } } : false,
      reviews: user ? { where: { userId: user.id } } : false,
    },
  });

  if (!course) notFound();

  const courseDetail: CourseDetailUI = {
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
    items: course.items.map((item) => {
      const completed =
        item.type === "MODULE"
          ? !!item.module?.progresses?.[0]?.completedAt
          : !!item.workshop?.submissions?.[0]?.score;

      return {
        id: item.id,
        slug: item.slug,
        type: item.type,
        position: item.position,
        title: item.module?.title ?? item.workshop?.title ?? "Untitled Item",
        completed,
      };
    }),

    isFavorite: user ? course.favorites.length > 0 : false,
    userRating: course.reviews?.[0]?.rating ?? 0,
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

  const isAuthenticated = !!user;
  const progress = isAuthenticated
    ? Number(enrollment?.progressPercent ?? 0)
    : 0;
  const nextItem = isAuthenticated ? await getNextCourseItem(course.id) : null;

  return (
    <CourseDetails
      course={courseDetail}
      isEnrolled={!!enrollment}
      isAuthenticated={isAuthenticated}
      progress={progress}
      nextItem={nextItem}
    />
  );
}
