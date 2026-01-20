import Link from "next/link";

interface ActiveEnrollment {
  progressPercent: number;
  course: {
    title: string;
    slug: string;
    level: string;
    category: {
      name: string;
    };
  };
}

interface ActiveCourseBannerProps {
  activeEnrollment?: ActiveEnrollment | null;
}

export function ActiveCourseBanner({
  activeEnrollment,
}: ActiveCourseBannerProps) {
  if (!activeEnrollment) {
    return (
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
    );
  }

  return (
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
              <span className="text-[10px] font-bold text-blue-50 tracking-widest uppercase mb-1">
                Current Progress
              </span>
              <span className="text-2xl font-bold text-white">
                {Math.round(activeEnrollment.progressPercent)}%
              </span>
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
  );
}