import { Metadata } from "next";
import Courses from "@/components/Courses";
import { getCourses } from "@/lib/data/courses";
import { getCategories } from "@/lib/data/categories";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;

  const category = typeof params.category === "string" ? params.category : null;

  const title = category ? `${category} Courses | EduTIA` : "Courses | EduTIA";

  const description = category
    ? `Browse ${category} courses on EduTIA and start learning today.`
    : "Browse all available courses on EduTIA and start learning today.";

  return {
    title,
    description,
  };
}

export default async function CoursesPage({ searchParams }: PageProps) {
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
