import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import CourseItemViewer from "@/components/CourseItemViewer";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
    itemSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, itemSlug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    select: { title: true },
  });

  const item = await prisma.courseItem.findFirst({
    where: {
      slug: itemSlug,
      course: { slug },
    },
    select: {
      module: { select: { title: true } },
      workshop: { select: { title: true } },
    },
  });

  if (!course || !item) {
    return {
      title: "Item Not Found | EduTIA",
      robots: { index: false, follow: false },
    };
  }

  const itemTitle = item.module?.title ?? item.workshop?.title ?? "Course Item";

  return {
    title: `${itemTitle} – ${course.title} | EduTIA`,
    description: `Lesson from the course "${course.title}".`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CourseItemPage({ params }: PageProps) {
  const { slug, itemSlug } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return redirect(`/login?callbackUrl=/courses/${slug}/${itemSlug}`);
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true, slug: true },
  });

  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  if (!enrollment) {
    return redirect(`/courses/${slug}`);
  }

  const item = await prisma.courseItem.findFirst({
    where: {
      slug: itemSlug,
      courseId: course.id,
    },
    include: {
      module: {
        include: {
          progresses: {
            where: { userId: user.id },
          },
        },
      },
      workshop: {
        include: {
          submissions: {
            where: { userId: user.id },
            orderBy: { submittedAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!item) notFound();

  const prevItem = await prisma.courseItem.findFirst({
    where: {
      courseId: course.id,
      position: { lt: item.position },
    },
    orderBy: { position: "desc" },
    select: {
      slug: true,
      module: { select: { title: true } },
      workshop: { select: { title: true } },
    },
  });

  const nextItem = await prisma.courseItem.findFirst({
    where: {
      courseId: course.id,
      position: { gt: item.position },
    },
    orderBy: { position: "asc" },
    select: {
      slug: true,
      module: { select: { title: true } },
      workshop: { select: { title: true } },
    },
  });

  const submission =
    item.type === "WORKSHOP" ? item.workshop?.submissions[0] : null;

  const isCompleted =
    item.type === "MODULE"
      ? !!item.module?.progresses?.[0]?.completedAt
      : submission?.score != null;

  const title = item.module?.title ?? item.workshop?.title ?? "Untitled";

  const transformedItem = {
    id: item.id,
    title,
    type: item.type,
    module: item.module
      ? {
          id: item.module.id,
          contentUrl: item.module.contentUrl,
        }
      : null,
    workshop: item.workshop
      ? {
          id: item.workshop.id,
          instructions: item.workshop.instructions,
        }
      : null,
  };

  const transformedPrev = prevItem
    ? {
        slug: prevItem.slug,
        title:
          prevItem.module?.title ??
          prevItem.workshop?.title ??
          "Previous Lesson",
      }
    : null;

  const transformedNext = nextItem
    ? {
        slug: nextItem.slug,
        title:
          nextItem.module?.title ?? nextItem.workshop?.title ?? "Next Lesson",
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CourseItemViewer
          item={transformedItem}
          courseSlug={course.slug}
          isCompleted={isCompleted}
          submission={submission}
          prevItem={transformedPrev}
          nextItem={transformedNext}
        />
      </div>
    </div>
  );
}
