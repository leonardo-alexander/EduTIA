import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateCoursePopover from "@/components/admin/CreateCourse";
import { getCategories } from "@/lib/data/categories";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Courses | EduTIA",
    description: "Manage and organize courses on the platform.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      category: true,
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: [
      { isPublished: "desc" },
      {
        enrollments: {
          _count: "desc",
        },
      },
      { title: "asc" },
    ],
  });

  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <CreateCoursePopover categories={categories} />
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3 border-l">Category</th>
            <th className="p-3 border-l">Published</th>
            <th className="p-3 border-l">Enrollments</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3">
                <Link
                  href={`/admin/courses/${c.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {c.title}
                </Link>
              </td>
              <td className="p-3 border-l">{c.category.name}</td>
              <td className="p-3 border-l text-center">
                {c.isPublished ? "Yes" : "No"}
              </td>
              <td className="p-3 border-l text-center">
                {c._count.enrollments}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
