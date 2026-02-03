import { Metadata } from "next";
import Courses from "@/components/Courses";
import { getCourses } from "@/lib/data/courses";
import { getCategories } from "@/lib/data/categories";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Courses | EduTIA"
};

export default async function Page({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value) {
      params.set(key, value);
    }
  }

  const [courses, categories] = await Promise.all([
    getCourses(params, user?.id),
    getCategories(),
  ]);

  return (
    <Courses
      courses={courses}
      categories={categories}
      isAuthenticated={!!user}
    />
  );
}
