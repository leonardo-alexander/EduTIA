import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreatePathPopover from "@/components/admin/CreatePath";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Learning Paths | EduTIA",
    description: "Manage and organize learning paths on the platform.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminPathsPage() {
  const paths = await prisma.learningPath.findMany({
    include: {
      _count: {
        select: { items: true },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Learning Paths</h1>
        <CreatePathPopover />
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3 border-l">Published</th>
            <th className="p-3 border-l">Items</th>
          </tr>
        </thead>
        <tbody>
          {paths.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">
                <Link
                  href={`/admin/paths/${p.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {p.title}
                </Link>
              </td>
              <td className="p-3 border-l text-center">
                {p.isPublished ? "Yes" : "No"}
              </td>
              <td className="p-3 border-l text-center">{p._count.items}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
