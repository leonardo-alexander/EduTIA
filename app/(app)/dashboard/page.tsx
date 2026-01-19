import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ActiveCourseBanner } from "@/components/ActiveCourseBanner";
import { DashboardStats } from "@/components/DashboardStats";
import { EnrolledCourseList } from "@/components/EnrolledCourseList";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const name = user.profile?.name || user.email.split("@")[0] || "User";

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          category: true,
        },
      },
    },
  });

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { courseId: true },
  });
  const favoriteIds = new Set(favorites.map((f) => f.courseId));

  const completedCount = enrollments.filter(
    (e) => e.status === "COMPLETED"
  ).length;
  const inProgressCount = enrollments.filter(
    (e) => e.status === "IN_PROGRESS"
  ).length;

  const totalMinutesSpent = enrollments.reduce((acc, enrollment) => {
    const duration = enrollment.course.duration || 0;
    const progress = enrollment.progressPercent || 0;
    return acc + duration * (progress / 100);
  }, 0);
  const hoursSpent = Math.round(totalMinutesSpent / 60);

  const sortedCourses = enrollments
    .map((enrollment) => ({
      ...enrollment,
      isFavorite: favoriteIds.has(enrollment.courseId),
    }))
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.course.updatedAt.getTime() - a.course.updatedAt.getTime();
    });

  const activeEnrollment =
    enrollments.find((e) => e.status === "IN_PROGRESS") || enrollments[0];

  return (
    <main className="bg-white min-h-screen max-w-7xl mx-auto px-6 py-6 lg:px-8 flex flex-row flex-wrap content-start gap-6 lg:gap-8">
      <h1 className="pt-2 w-full text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900 leading-tight">
        Hello, <span className="text-eduBlue">{name}</span>
      </h1>

      <div className="w-full">
        <ActiveCourseBanner activeEnrollment={activeEnrollment} />
      </div>

      <div className="flex-1 w-full min-w-0 h-auto lg:h-[26rem]">
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