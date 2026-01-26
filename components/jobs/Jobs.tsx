"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, X, Star } from "lucide-react";
import JobCard from "./JobCard";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryUI } from "@/types/category.ui";
import { JobUI } from "@/types/job.ui";
import { JobType, WorkMode } from "@prisma/client";

type CoursesProps = {
  jobs: JobUI[];
  categories: CategoryUI[];
  isAuthenticated: boolean;
};

const TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
};

const SALARY_OPTIONS = [
  { label: "Any", value: "" },
  { label: "5 jt", value: "5000000" },
  { label: "10 jt", value: "10000000" },
  { label: "15 jt", value: "15000000" },
  { label: "20 jt", value: "20000000" },
  { label: "25 jt", value: "25000000" },
];

export default function Jobs({
  jobs,
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

  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  function updateParams(mutator: (params: URLSearchParams) => void) {
    const next = new URLSearchParams(params);
    mutator(next);
    router.push(`/jobs?${next.toString()}`, { scroll: false });
  }

  function handleCategoryToggle(category: string): void {
    updateParams((params) => {
      const selected = params.getAll("category");
      params.delete("category");

      if (selected.includes(category)) {
        selected
          .filter((l) => l !== category)
          .forEach((l) => params.append("category", l));
      } else {
        selected.forEach((l) => params.append("category", l));
        params.append("category", category);
      }
    });
  }

  function handleTypeToggle(type: string): void {
    updateParams((params) => {
      const selected = params.getAll("type");
      params.delete("type");

      if (selected.includes(type)) {
        selected
          .filter((l) => l !== type)
          .forEach((l) => params.append("type", l));
      } else {
        selected.forEach((l) => params.append("type", l));
        params.append("type", type);
      }
    });
  }

  function handleModeToggle(mode: string): void {
    updateParams((params) => {
      const selected = params.getAll("mode");
      params.delete("mode");

      if (selected.includes(mode)) {
        selected
          .filter((l) => l !== mode)
          .forEach((l) => params.append("mode", l));
      } else {
        selected.forEach((l) => params.append("mode", l));
        params.append("mode", mode);
      }
    });
  }

  function applySalaryFilter() {
    if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax)) {
      alert("Minimum salary cannot be higher than maximum salary");
      return;
    }

    updateParams((params) => {
      salaryMin ? params.set("min", salaryMin) : params.delete("min");
      salaryMax ? params.set("max", salaryMax) : params.delete("max");
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
            <h1 className="text-lg font-bold text-slate-900">Jobs</h1>
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
            overflow-y-auto transition-transform duration-300 ease-in-out lg:px-2
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
                  Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={params
                            .getAll("category")
                            .includes(category.slug)}
                          onChange={() => handleCategoryToggle(category.slug)}
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
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Types
                </h3>
                <div className="space-y-3">
                  {Object.values(JobType).map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={params.getAll("type").includes(type)}
                          onChange={() => handleTypeToggle(type)}
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
                        {TYPE_LABELS[type]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Work Modes
                </h3>
                <div className="space-y-3">
                  {Object.values(WorkMode).map((mode) => (
                    <label
                      key={mode}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={params.getAll("mode").includes(mode)}
                          onChange={() => handleModeToggle(mode)}
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
                        {mode.toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Salary
                </h3>

                <div className="flex items-center gap-2">
                  <select
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eduBlue/20"
                  >
                    <option value="">Min</option>
                    {SALARY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <span className="text-slate-400">—</span>

                  <select
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eduBlue/20"
                  >
                    <option value="">Max</option>
                    {SALARY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={applySalaryFilter}
                  className="mt-3 w-full bg-eduBlue text-white py-2 rounded-lg text-sm font-semibold hover:bg-eduBlue/90 transition"
                >
                  Apply
                </button>
              </div>

              <Link
                href="/jobs"
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
                <span className="text-slate-900 font-bold">{jobs.length}</span>{" "}
                jobs
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

            {jobs.length > 0 ? (
              <div className="grid gap-6 mx-10 md:grid-cols-2 sm:mx-0">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
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
                  href="/jobs"
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
