import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      category: true,
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Courses</h1>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Title</th>
            <th>Category</th>
            <th>Published</th>
            <th>Enrollments</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3">
                <Link
                  href={`/admin/courses/${c.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {c.title}
                </Link>
              </td>
              <td>{c.category.name}</td>
              <td>{c.isPublished ? "Yes" : "No"}</td>
              <td>{c._count.enrollments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
