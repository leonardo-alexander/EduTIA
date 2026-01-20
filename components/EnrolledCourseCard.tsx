import Link from "next/link";
import { Heart } from "lucide-react";

interface EnrolledCourseCardProps {
  enrollment: any;
}

export function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  return (
    <Link
      href={`/courses/${enrollment.course.slug}`}
      className="group flex gap-3 p-2.5 bg-white border border-slate-100 rounded-2xl hover:border-eduBlue/40 hover:shadow-md transition-all duration-200 relative overflow-hidden shrink-0"
    >
      {enrollment.isFavorite && (
        <div className="absolute top-0 right-0 p-2 z-10">
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        </div>
      )}

      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
        <img
          src={enrollment.course.thumbnailUrl || "/thumbnail.jpeg"}
          alt={enrollment.course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-eduBlue transition-colors pr-6">
          {enrollment.course.title}
        </h3>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] text-slate-500 truncate pr-8">
            {enrollment.course.category.name}
          </span>
        </div>
      </div>

      <div className="absolute bottom-2.5 right-3">
        <span
          className={`text-sm font-black ${
            enrollment.progressPercent >= 100
              ? "text-emerald-500"
              : "text-slate-300 group-hover:text-eduBlue transition-colors"
          }`}
        >
          {Math.round(enrollment.progressPercent)}%
        </span>
      </div>
    </Link>
  );
}