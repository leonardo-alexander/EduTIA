"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { Course, Category, CourseLevel } from "@prisma/client";

type CourseWithCategory = Course & {
  category: Category;
};

type CoursesProps = {
  courses: CourseWithCategory[];
  categories: Category[];
};

export default function Courses({ courses, categories }: CoursesProps) {
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<CourseLevel[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "ascending" | "descending">("default");

  useEffect(() => {
    // search parameter
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
    }

    // category parameter
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const category = categories.find((c) => c.slug === categorySlug);
      if (category) {
        setSelectedCategories([category.id]);
      }
    }
  }, [searchParams, categories]);

  //toggle selection helper
  const toggleSelection = <T,>(item: T, list: T[], setList: (l: T[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // filter and sort logics
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // filter by search
        const matchesSearch =
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase());

        // filter by category
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(course.categoryId);

        // filter diffculty level
        const matchesLevel =
          selectedLevels.length === 0 || selectedLevels.includes(course.level);

        return matchesSearch && matchesCategory && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === "ascending") {
          return a.title.localeCompare(b.title);
        }
        else if (sortBy === "descending") {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
  }, [courses, searchQuery, selectedCategories, selectedLevels, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* semi header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-extrabold text-slate-900">All Courses</h1>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative grow md:grow-0 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-eduBlue/20 focus:border-eduBlue transition-all"
                />
              </div>
              
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="md:hidden p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* sidebar */}
          <aside className={`
            fixed inset-0 bg-white lg:bg-transparent 
            lg:sticky lg:top-6 lg:w-64 lg:block lg:h-[calc(100vh-3rem)] lg:overflow-y-auto 
            overflow-y-auto transition-transform duration-300 ease-in-out
            ${mobileFiltersOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}>
            <div className="p-6 lg:p-0 h-full">
              <div className="flex items-center justify-between lg:hidden mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              {/* filter by category */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleSelection(category.id, selectedCategories, setSelectedCategories)}
                          className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-eduBlue checked:border-eduBlue transition-all"
                        />
                        <svg
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-600 group-hover:text-eduBlue transition-colors">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* levels difficulty filter */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Level</h3>
                <div className="space-y-3">
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => (
                    <label key={level} className="flex items-center gap-3 group cursor-pointer">
                       <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level as CourseLevel)}
                          onChange={() => toggleSelection(level as CourseLevel, selectedLevels, setSelectedLevels)}
                          className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-eduBlue checked:border-eduBlue transition-all"
                        />
                        <svg
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-600 group-hover:text-eduBlue capitalize transition-colors">
                        {level.toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedLevels([]);
                  setSearchQuery("");
                }}
                className="w-full py-2 text-sm font-bold text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* main contents */}
          <main className="flex-1">
            {/* sort toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 font-medium">
                Showing <span className="text-slate-900 font-bold">{filteredCourses.length}</span> courses
              </p>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 hidden sm:inline">Sort by:</span>
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2 rounded-lg text-sm font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-eduBlue/20 focus:border-eduBlue"
                  >
                    <option value="default">Default</option>
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* courses grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No courses found</h3>
                <p className="text-slate-500">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button 
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedLevels([]);
                    setSearchQuery("");
                  }}
                  className="mt-6 text-eduBlue font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}