import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, CheckCircle, Clock, Heart } from "lucide-react";

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

  const completedCount = enrollments.filter((e) => e.status === "COMPLETED").length;
  const inProgressCount = enrollments.filter((e) => e.status === "IN_PROGRESS").length;

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
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-6 lg:px-8 flex flex-col gap-6 lg:gap-8">
        
        <header className="pt-2">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900 leading-tight">
            Hello, <span className="text-eduBlue">{name}</span>
          </h1>
        </header>

        {activeEnrollment ? (
          <section className="w-full">
            <Link href={`/courses/${activeEnrollment.course.slug}`}>
              <div className="w-full bg-eduBlue rounded-3xl p-6 shadow-xl shadow-blue-900/10 text-white relative overflow-hidden group transition-transform active:scale-[0.99] duration-200 min-h-[230px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-medium tracking-wide">
                      RESUME LEARNING
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl lg:text-3xl font-bold leading-tight mb-2">
                      {activeEnrollment.course.title}
                    </h2>

                    <p className="text-blue-100 text-xs font-medium">
                      {activeEnrollment.course.category.name} •{" "}
                      {activeEnrollment.course.level}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 space-y-2 w-full mt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-blue-50 tracking-widest uppercase mb-1">Current Progress</span>
                    <span className="text-2xl font-bold text-white">{Math.round(activeEnrollment.progressPercent)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.6)] transition-all duration-1000 ease-out"
                      style={{ width: `${activeEnrollment.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        ) : (
          <div className="w-full p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center flex flex-col items-center justify-center min-h-[230px]">
            <p className="text-slate-500 mb-5 text-base">
              You haven't enrolled in any courses yet.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 bg-eduBlue text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-blue-600 transition-all text-sm"
            >
              Start Learning
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          
          <div className="flex-1 w-full min-w-0">
            <section className="bg-slate-50 rounded-3xl border border-slate-200/60 p-5 flex flex-col h-auto lg:h-[26rem]">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  My Courses
                </h2>
              </div>

              <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent flex-1">
                {sortedCourses.length > 0 ? (
                  sortedCourses.map((item) => (
                    <Link
                      key={item.id}
                      href={`/courses/${item.course.slug}`}
                      className="group flex gap-3 p-2.5 bg-white border border-slate-100 rounded-2xl hover:border-eduBlue/40 hover:shadow-md transition-all duration-200 relative overflow-hidden shrink-0"
                    >
                      {item.isFavorite && (
                        <div className="absolute top-0 right-0 p-2 z-10">
                          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        </div>
                      )}

                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                        <img
                          src={item.course.thumbnailUrl || "/thumbnail.jpeg"}
                          alt={item.course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-eduBlue transition-colors pr-6">
                          {item.course.title}
                        </h3>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] text-slate-500 truncate pr-8">
                            {item.course.category.name}
                          </span>
                        </div>
                      </div>

                      <div className="absolute bottom-2.5 right-3">
                        <span
                            className={`text-sm font-black ${
                                item.progressPercent >= 100
                                ? "text-emerald-500"
                                : "text-slate-300 group-hover:text-eduBlue transition-colors"
                            }`}
                        >
                            {Math.round(item.progressPercent)}%
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs italic">
                    <p>No active courses.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-3">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1.5 hover:bg-slate-100 transition-colors">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-eduBlue mb-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {inProgressCount}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                In Progress
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1.5 hover:bg-slate-100 transition-colors">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {completedCount}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Completed
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1.5 hover:bg-slate-100 transition-colors">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {hoursSpent}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Hours Spent
              </span>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}