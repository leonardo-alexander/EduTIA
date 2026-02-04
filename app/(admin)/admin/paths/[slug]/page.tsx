import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import UpdatePathPopover from "@/components/admin/UpdatePath";
import { PathUI } from "@/types/path.ui";
import DeletePathButton from "@/components/admin/DeletePath";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Path Detail | EduTIA",
    description: "View and manage a learning path.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminPathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  const rawPath = await prisma.learningPath.findUnique({
    where: { slug },
    include: {
      items: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!rawPath) return null;

  const path: PathUI = {
    ...rawPath,
    items: rawPath.items.map((item) => ({
      id: item.id,
      position: item.position,
      course: {
        id: item.course.id,
        title: item.course.title,
        slug: item.course.slug,
        duration: item.course.duration,
      },
    })),
  };

  if (!path) notFound();

  return (
    <div className="flex flex-col gap-5">
      <Link href={"/admin/paths"} className="flex items-center gap-1">
        <ArrowLeft className="h-5 w-5" />
        <span className="leading-none">Back to paths</span>
      </Link>
      <h1 className="text-2xl font-bold">{path.title}</h1>
      <div className="flex gap-3">
        <UpdatePathPopover path={path} />
        <DeletePathButton pathId={path.id} />
      </div>
      <div>
        <div className="flex flex-col">
          <p className="flex gap-1">
            <b>Thumbnail:</b>
            <Link
              href={path.thumbnailUrl}
              className="text-blue-600 hover:underline"
            >
              {path.thumbnailUrl}
            </Link>
          </p>
          <img src={path.thumbnailUrl} alt={path.title} className="w-xs" />
        </div>
        <p>
          <b>Description:</b> {path.description}
        </p>
        <p>
          <b>Published:</b> {path.isPublished ? "Yes" : "No"}
        </p>
        <div>
          <p>
            <b>Path Items:</b>
          </p>
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Position</th>
                <th className="p-3 border-l">Title</th>
              </tr>
            </thead>
            <tbody>
              {path.items.map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="p-3 text-center">{i.position}</td>
                  <td className="p-3 border-l">{i.course.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
