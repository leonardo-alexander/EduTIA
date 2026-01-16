import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { CourseUI } from "@/types/course-ui";

export default function CourseCard({ course }: { course: CourseUI }) {
  return (
    <Link
      key={course.id}
      href={`/courses/${course.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-lg shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={course.thumbnailUrl || "/thumbnail.jpeg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          {course.category.name}
        </span>
      </div>

      <div className="p-6 flex flex-col grow gap-4">
        <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-eduBlue transition-colors line-clamp-2">
          {course.title}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed grow line-clamp-3">
          {course.description}
        </p>

        <div className="flex items-center gap-2 text-sm mt-2">
          <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
          <span className="font-bold text-slate-900">
            {Number(course.avgRating).toFixed(1)}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">{course.reviewCount} reviews</span>
        </div>

        {/* <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <span className="font-bold text-eduBlue text-sm">View Syllabus</span>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-eduBlue transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </div> */}

        {/* <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-eduBlue">
            View syllabus
          </span>
          <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-eduBlue transition-colors">
            <ArrowRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </div> */}
      </div>
    </Link>
  );
}
