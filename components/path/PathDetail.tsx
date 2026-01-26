"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock, PlayCircle } from "lucide-react";
import { PathDetailUI } from "@/types/path.ui";
import { FavoriteButton } from "../FavoriteButton";
import BackButton from "../BackButton";

export default function PathDetails({
  path,
  isAuthenticated,
  nextCourseSlug,
}: {
  path: PathDetailUI;
  isAuthenticated: boolean;
  nextCourseSlug: string;
}) {
  const totalDurationMinutes = path.items.reduce(
    (acc, item) => acc + item.course.duration,
    0,
  );
  const totalHours = Math.max(1, Math.round(totalDurationMinutes / 60));
  const totalCourses = path.items.length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* sub header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <BackButton />

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            {path.title}
          </h1>

          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed mb-8">
            {path.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-eduBlue" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Courses
                </p>
                <p className="font-bold text-slate-900">{totalCourses} Steps</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-eduBlue" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Duration
                </p>
                <p className="font-bold text-slate-900">{totalHours} Hours</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-eduBlue hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg"
              >
                <PlayCircle className="w-5 h-5" />
                Start Learning Path
              </Link>
            ) : nextCourseSlug ? (
              <Link
                href={`/courses/${nextCourseSlug}`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg"
              >
                <PlayCircle className="w-5 h-5" />
                Continue Learning
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg">
                Path Completed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* timeline */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl font-bold text-slate-900 mb-10">
          Path Curriculum
        </h2>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-slate-200 hidden md:block" />

          <div className="space-y-8">
            {path.items.map((item, index) => {
              const { course } = item;

              return (
                <div
                  key={item.id}
                  className="relative flex flex-col md:flex-row gap-6 md:gap-10 group"
                >
                  {/* number */}
                  <div className="hidden md:flex flex-none z-10">
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-eduBlue text-eduBlue font-bold text-2xl flex items-center justify-center shadow-sm group-hover:bg-eduBlue group-hover:text-white transition-colors duration-300">
                      {index + 1}
                    </div>
                  </div>

                  {/* number mobile */}
                  <div className="md:hidden flex items-center gap-3 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-eduBlue text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      Step {index + 1}
                    </span>
                  </div>

                  {/* card */}
                  <Link
                    href={`/courses/${course.slug}`}
                    className="grow bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-eduBlue/30 transition-all duration-300 group-hover:-translate-y-1"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* thumbnail */}
                      <div className="w-full sm:w-48 h-32 flex-none rounded-xl overflow-hidden bg-slate-100 relative">
                        <img
                          src={course.thumbnailUrl || "/thumbnail.jpeg"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <FavoriteButton
                          courseId={course.id}
                          isFavorite={course.isFavorite}
                          isAuthenticated={isAuthenticated}
                          className="absolute top-3 left-3 z-40"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      </div>

                      {/* info */}
                      <div className="flex flex-col justify-between grow">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                              {course.category.name}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-eduBlue text-xs font-bold uppercase tracking-wider">
                              {course.level}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-eduBlue transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-6 mt-4 text-xs font-bold text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" />
                            <span>{course._count.items} Lessons</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>
                              {Math.round(course.duration / 60)}h{" "}
                              {course.duration % 60}m
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* arrow icon */}
                      <div className="hidden sm:flex flex-col justify-center items-center pl-4 border-l border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-eduBlue group-hover:text-white transition-all">
                          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* finish node */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 mt-8 opacity-50">
            <div className="hidden md:flex flex-none z-10 ml-5">
              <div className="w-6 h-6 rounded-full bg-slate-200 border-4 border-white shadow-sm" />
            </div>
            <div className="text-slate-400 font-medium italic pl-1">
              Path Completion
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
