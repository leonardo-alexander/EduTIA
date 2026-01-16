import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { CourseUI } from "@/types/course-ui";

export default function CourseCard({ course }: { course: CourseUI }) {
  return (
    <Link
      key={course.id}
      href={`/courses/${course.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <img
          src={course.thumbnailUrl || "/thumbnail.jpeg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md ring-1 ring-black/5">
          {course.category.name}
        </span>
      </div>
      <div className="p-6 flex flex-col grow">
        <h3 className="text-xl font-bold leading-snug text-slate-900 mb-3 group-hover:text-eduBlue transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 grow line-clamp-3">
          {course.description}
        </p>
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="w-4.5 h-4.5 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold text-slate-700">
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
          <div
            className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-eduBlue transition-colors"
          >
            <ArrowRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </div> */}
      </div>
    </Link>
  );
}
