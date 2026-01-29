export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ActiveCourseBanner } from "@/components/dashboard/ActiveCourseBanner";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { EnrolledCourseList } from "@/components/dashboard/EnrolledCourseList";

export default async function EducateeDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const name = user.profile?.name || user.email.split("@")[0] || "User";

  const [enrollments, favorites] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: { category: true },
        },
      },
    }),
    prisma.favorite.findMany({
      where: { userId: user.id },
      select: { courseId: true },
    }),
  ]);

  const favoriteIds = new Set(favorites.map((f) => f.courseId));

  const completedCount = enrollments.filter(
    (e) => e.status === "COMPLETED",
  ).length;
  const inProgressCount = enrollments.filter(
    (e) => e.status === "IN_PROGRESS",
  ).length;

  const hoursSpent = Math.round(
    enrollments.reduce(
      (acc, e) =>
        acc + (e.course.duration ?? 0) * ((e.progressPercent ?? 0) / 100),
      0,
    ) / 60,
  );

  const sortedCourses = enrollments
    .map((e) => ({
      ...e,
      isFavorite: favoriteIds.has(e.courseId),
    }))
    .sort(
      (a, b) =>
        Number(b.isFavorite) - Number(a.isFavorite) ||
        b.course.updatedAt.getTime() - a.course.updatedAt.getTime(),
    );

  const activeEnrollment =
    enrollments.find((e) => e.status === "IN_PROGRESS") ?? null;

  return (
    <main className="bg-white min-h-screen max-w-7xl mx-auto px-6 py-6 lg:px-8 flex flex-row flex-wrap content-start gap-6 lg:gap-8">
      <h1 className="pt-2 w-full text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900 leading-tight">
        Hello, <span className="text-eduBlue">{name}</span>
      </h1>

      <div className="w-full">
        <ActiveCourseBanner activeEnrollment={activeEnrollment} />
      </div>

      <div className="flex-1 w-full min-w-0 h-auto lg:h-104">
        <EnrolledCourseList courses={sortedCourses} />
      </div>

      <div className="w-full lg:w-64 shrink-0">
        <DashboardStats
          inProgressCount={inProgressCount}
          completedCount={completedCount}
          hoursSpent={hoursSpent}
        />
      </div>
    </main>
  );
}
