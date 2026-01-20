"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, X, Star } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { CourseUI } from "@/types/course.ui";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryUI } from "@/types/category.ui";

type CoursesProps = {
  courses: CourseUI[];
  categories: CategoryUI[];
  isAuthenticated: boolean;
};

const DURATION_LABELS: Record<string, string> = {
  extraShort: "0–2 hours",
  short: "2–5 hours",
  medium: "5–10 hours",
  long: "10–20 hours",
  extraLong: "20+ hours",
};

export default function Courses({
  courses,
  categories,
  isAuthenticated,
}: CoursesProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  function getCategory(): string {
    const categorySlug = params.get("category");

    if (!categorySlug) return "All";

    const category = categories.find((cat) => cat.slug === categorySlug);

    return category?.name ?? "All";
  }

  function updateParams(mutator: (params: URLSearchParams) => void) {
    const next = new URLSearchParams(searchParams.toString());
    mutator(next);
    router.push(`/courses?${next.toString()}`, { scroll: false });
  }

  function handleRatingToggle(rating: string): void {
    updateParams((params) => {
      params.get("rating") === rating
        ? params.delete("rating")
        : params.set("rating", rating);
    });
  }

  function handleLevelToggle(level: string): void {
    updateParams((params) => {
      const selected = params.getAll("level");
      params.delete("level");

      if (selected.includes(level)) {
        selected
          .filter((l) => l !== level)
          .forEach((l) => params.append("level", l));
      } else {
        selected.forEach((l) => params.append("level", l));
        params.append("level", level);
      }
    });
  }

  function handleDurationToggle(duration: string): void {
    updateParams((params) => {
      const selected = params.getAll("duration");
      params.delete("duration");

      if (selected.includes(duration)) {
        selected
          .filter((d) => d !== duration)
          .forEach((d) => params.append("duration", d));
      } else {
        selected.forEach((d) => params.append("duration", d));
        params.append("duration", duration);
      }
    });
  }

  function handleSort(value: string): void {
    updateParams((params) => {
      value === "default" ? params.delete("sort") : params.set("sort", value);
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 md:flex-row">
            <h1 className="text-lg font-bold text-slate-900">
              {getCategory()} Courses
            </h1>
            <div className="flex-1">
              <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="lg:hidden p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside
            className={`z-40
            fixed inset-0 bg-white lg:bg-transparent 
            lg:sticky lg:top-6 lg:w-64 lg:block lg:h-[calc(100vh-3rem)] lg:overflow-y-auto 
            overflow-y-auto transition-transform duration-300 ease-in-out
            ${
              mobileFiltersOpen
                ? "translate-x-0 sm:w-80"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
          >
            <div className="p-6 lg:p-0 h-full">
              <div className="flex items-center justify-between lg:hidden mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Ratings
                </h3>
                <div className="space-y-3">
                  {["4.5", "4.0", "3.5", "3.0"].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="relative w-5 h-5">
                        <input
                          type="checkbox"
                          checked={params.get("rating") === rating}
                          onChange={() => handleRatingToggle(rating)}
                          className="peer appearance-none w-5 h-5 rounded-full border-2 border-slate-300 bg-white checked:border-eduBlue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eduBlue/40"
                        />

                        <span className="pointer-events-none absolute inset-1 rounded-full bg-eduBlue opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>

                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-slate-600 group-hover:text-eduBlue transition-colors">
                        {rating}+
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Levels
                </h3>
                <div className="space-y-3">
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={params.getAll("level").includes(level)}
                          onChange={() => handleLevelToggle(level)}
                          className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-eduBlue checked:border-eduBlue transition-all"
                        />
                        <svg
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-slate-600 group-hover:text-eduBlue capitalize transition-colors">
                        {level.toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Durations
                </h3>
                <div className="space-y-3">
                  {["extraShort", "short", "medium", "long", "extraLong"].map(
                    (duration) => (
                      <label
                        key={duration}
                        className="flex items-center gap-3 group cursor-pointer"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={params
                              .getAll("duration")
                              .includes(duration)}
                            onChange={() => handleDurationToggle(duration)}
                            className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-eduBlue checked:border-eduBlue transition-all"
                          />
                          <svg
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>

                        <span className="text-slate-600 group-hover:text-eduBlue transition-colors">
                          {DURATION_LABELS[duration]}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <Link
                href="/courses"
                className="mt-6 block w-full text-center py-3 text-sm font-bold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Clear Filters
              </Link>
            </div>
          </aside>

          {/* main contents */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 font-medium">
                Showing{" "}
                <span className="text-slate-900 font-bold">
                  {courses.length}
                </span>{" "}
                courses
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 hidden sm:inline">
                  Sort by:
                </span>
                <div className="relative group">
                  <select
                    value={params.get("sort") ?? "default"}
                    onChange={(e) => handleSort(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2 rounded-lg text-sm font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-eduBlue/20 focus:border-eduBlue"
                  >
                    <option value="default">Default</option>
                    <option value="rating">Highest Rated</option>
                    <option value="review">Most Reviewed</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {courses.length > 0 ? (
              <div className="grid gap-6 mx-10 sm:grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No courses found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <Link
                  href="/courses"
                  className="mt-6 inline-block px-1 py-2 text-sm font-bold text-eduBlue hover:underline hover:text-eduBlue/80 transition-colors"
                >
                  Clear all filters
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
