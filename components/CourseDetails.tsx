import Link from "next/link";
import {
  Clock,
  BarChart,
  BookOpen,
  PlayCircle,
  Code,
  ChevronLeft,
  Users,
  Calendar,
  Award,
  Lock,
  CheckCircle,
  Play,
  Star,
  MessageCircle,
} from "lucide-react";
import { CourseDetailUI } from "@/types/course-ui";
import { enrollCourse } from "@/actions/enroll";
import { getNextCourseItem } from "@/actions/resume";
import { getCourseProgress } from "@/actions/progress";

interface CourseDetailsProps {
  course: CourseDetailUI;
  isEnrolled: boolean;
  currentUserId?: string;
}

export default async function CourseDetails({
  course,
  isEnrolled,
  currentUserId,
}: CourseDetailsProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const nextItem = await getNextCourseItem(course.id);
  const startUrl = nextItem
    ? `/courses/${course.slug}/learn/${nextItem.id}`
    : "#";

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 relative z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/courses"
            className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <span className="bg-eduBlue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {course.category.name}
                </span>
                {isEnrolled && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Enrolled
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {course.title}
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                {course.description}
              </p>
            </div>
            <div className="lg:col-span-1 hidden lg:block"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* side bar */}
          <div className="lg:col-span-1 lg:order-last relative lg:pb-12">
            <div className="relative lg:-mt-48 z-10 lg:sticky top-24 self-start">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="aspect-video relative bg-slate-100 border-b border-slate-100">
                  <img
                    src={course.thumbnailUrl || "/thumbnail.jpeg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    {course.category.name}
                  </span>
                </div>

                <div className="p-6 flex flex-col gap-5">
                  <div>
                    {/* not done, dont forget rating */}
                    <span>Completion: {getCourseProgress(course.id)}%</span>
                  </div>
                  <div className="flex flex-col gap-5">
                    {isEnrolled ? (
                      <Link
                        href={startUrl}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        Continue Learning
                      </Link>
                    ) : currentUserId ? (
                      <form
                        action={enrollCourse.bind(null, course.id, course.slug)}
                      >
                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 bg-eduBlue hover:bg-blue-600 text-white font-bold text-lg py-4 rounded-xl transition-all"
                        >
                          Start Learning Now
                        </button>
                      </form>
                    ) : (
                      <Link
                        href="/login"
                        className="w-full flex items-center justify-center gap-2 bg-eduBlue hover:bg-blue-600 text-white font-bold text-lg py-4 rounded-xl transition-all"
                      >
                        Start Learning Now
                      </Link>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                      Course Details
                    </h3>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Star className="w-5 h-5 text-slate-400" />
                        <span>Rating</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {course.avgRating.toFixed(1)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-slate-600">
                        <MessageCircle className="w-5 h-5 text-slate-400" />
                        <span>Reviews</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {course.reviewCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Users className="w-5 h-5 text-slate-400" />
                        <span>Students Enrolled</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {course.enrollmentCount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-slate-600">
                        <BarChart className="w-5 h-5 text-slate-400" />
                        <span>Level</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {formatLevel(course.level)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <span>Duration</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {formatDuration(course.duration)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-slate-600">
                        <BookOpen className="w-5 h-5 text-slate-400" />
                        <span>Lessons</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {course.items.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <span>Last Updated</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {formatDate(course.updatedAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Award className="w-5 h-5 text-slate-400" />
                        <span>Certificate</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        Included
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* main content */}
          <div className="lg:col-span-2 py-12 space-y-8">
            {/* highlights */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-wrap justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <BarChart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">
                    Difficulty
                  </p>
                  <p className="font-bold text-slate-900">
                    {formatLevel(course.level)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">
                    Duration
                  </p>
                  <p className="font-bold text-slate-900">
                    {formatDuration(course.duration)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">
                    Lessons
                  </p>
                  <p className="font-bold text-slate-900">
                    {course.items.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">
                    Certificate
                  </p>
                  <p className="font-bold text-slate-900">Included</p>
                </div>
              </div>
            </div>

            {/* contents */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Course Curriculum
              </h2>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {course.items.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No content available for this course yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {course.items.map((item, index) => {
                      const { id, type, title } = item;
                      const isModule = type === "MODULE";
                      const Icon = isModule ? PlayCircle : Code;

                      const isLocked = !isEnrolled;
                      const itemUrl = isLocked
                        ? "#"
                        : `/courses/${course.slug}/learn/${item.id}`;

                      return (
                        <Link
                          key={item.id}
                          href={itemUrl}
                          className={`
                            p-5 flex items-center gap-4 transition-colors group
                            ${
                              isLocked
                                ? "cursor-not-allowed opacity-75"
                                : "cursor-pointer hover:bg-slate-50"
                            }
                          `}
                        >
                          <div className="shrink-0">
                            <span
                              className={`
                              flex items-center justify-center w-10 h-10 rounded-full transition-all
                              ${
                                isLocked
                                  ? "bg-slate-100 text-slate-400"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-eduBlue group-hover:text-white"
                              }
                            `}
                            >
                              {isLocked ? (
                                <Lock className="w-5 h-5" />
                              ) : (
                                <Icon className="w-5 h-5" />
                              )}
                            </span>
                          </div>

                          <div className="grow min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className={`font-semibold truncate transition-colors ${
                                  isLocked
                                    ? "text-slate-500"
                                    : "text-slate-800 group-hover:text-eduBlue"
                                }`}
                              >
                                {title || "Untitled Item"}
                              </h3>
                              {item.type === "WORKSHOP" && (
                                <span className="text-[10px] font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded border border-purple-200 shrink-0">
                                  WORKSHOP
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">
                              Lesson {index + 1}
                            </p>
                          </div>

                          <div className="text-slate-300">
                            {isLocked ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-eduBlue opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
