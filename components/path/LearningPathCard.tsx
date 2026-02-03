import Link from "next/link";
import { PathUI } from "@/types/path.ui";

export default function LearningPathCard({
  learningPath,
}: {
  learningPath: PathUI;
}) {
  const totalDurationMinutes = learningPath.items.reduce(
    (acc, item) => acc + item.course.duration,
    0,
  );
  const totalHours = Math.max(1, Math.round(totalDurationMinutes / 60));
  const courseCount = learningPath.items.length;

  return (
    <Link
      href={`/path/${learningPath.slug}`}
      className="group relative block w-full h-70 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
    >
      <div className="absolute inset-0">
        <img
          src={learningPath.thumbnailUrl}
          alt={learningPath.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-2/3 backdrop-blur-sm pointer-events-none"
        style={{
          maskImage: "linear-gradient(to top, black, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-slate-900/80 via-slate-900/30 to-transparent pointer-events-none" />

      <div className="absolute inset-0 p-8 flex flex-col items-end justify-end text-right z-10">
        <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-sm">
          {learningPath.title}
        </h3>

        <div className="flex items-center gap-2 text-slate-200 font-medium text-sm tracking-wide">
          <span>{courseCount} Courses</span>
          <span className="w-1 h-1 rounded-full bg-slate-400" />
          <span>{totalHours} Hours</span>
        </div>
      </div>
    </Link>
  );
}
