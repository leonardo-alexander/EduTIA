"use client";

import { useState } from "react";
import { EnrolledCourseList } from "./EnrolledCourseList";
import { EnrollmentUI } from "@/types/enrollment.ui";

interface Props {
  courses: EnrollmentUI[];
}

export function EnrolledCourseSection({ courses }: Props) {
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const filtered =
    filter === "favorites" ? courses.filter((c) => c.isFavorite) : courses;

  return (
    <section>
      {/* Switch */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            filter === "all"
              ? "bg-eduBlue text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Enrolled
        </button>

        <button
          onClick={() => setFilter("favorites")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            filter === "favorites"
              ? "bg-eduBlue text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Favorites
        </button>
      </div>

      <EnrolledCourseList courses={filtered} />
    </section>
  );
}
