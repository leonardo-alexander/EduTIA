import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { getCategories } from "@/lib/data/categories";
import UpdateCoursePopover from "@/components/admin/UpdateCourse";
import DeleteCourseButton from "@/components/admin/DeleteCourse";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Course Detail | EduTIA",
    description: "View and manage a course on the platform.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      items: {
        orderBy: { position: "asc" },
        include: {
          module: true,
          workshop: true,
        },
      },
      enrollments: true,
    },
  });

  if (!course) notFound();

  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-5">
      <Link href={"/admin/courses"} className="flex items-center gap-1">
        <ArrowLeft className="h-5 w-5" />
        <span className="leading-none">Back to courses</span>
      </Link>
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <div className="flex gap-3">
        <UpdateCoursePopover path={course} categories={categories} />
        <DeleteCourseButton courseId={course.id} />
      </div>
      <div>
        <div className="flex flex-col">
          <p className="flex gap-1">
            <b>Thumbnail:</b>
            <Link
              href={course.thumbnailUrl}
              className="text-blue-600 hover:underline"
            >
              {course.thumbnailUrl}
            </Link>
          </p>
          <img src={course.thumbnailUrl} alt={course.title} className="w-xs" />
        </div>
        <div className="flex items-center gap-1.5">
          <b>Rating:</b> {course.avgRating}{" "}
          <Star className="inline h-4 w-4 my-auto text-yellow-400 fill-yellow-400" />{" "}
          ({course.reviewCount})
        </div>
        <p>
          <b>Description:</b> {course.description}
        </p>
        <p>
          <b>Category:</b> {course.category.name}
        </p>
        <p>
          <b>Level:</b> {course.level}
        </p>
        <p>
          <b>Duration:</b> {course.duration} minutes
        </p>
        <p>
          <b>Published:</b> {course.isPublished ? "Yes" : "No"}
        </p>
        <p>
          <b>Enrollments:</b> {course.enrollments.length}
        </p>
        <div>
          <p>
            <b>Course Items:</b>
          </p>
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Position</th>
                <th className="p-3 border-l">Type</th>
                <th className="p-3 border-l">Title</th>
                <th className="p-3 border-l">Detail</th>
              </tr>
            </thead>
            <tbody>
              {course.items.map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="p-3 text-center">{i.position}</td>
                  <td className="p-3 border-l">{i.type}</td>
                  <td className="p-3 border-l">
                    {i.type === "MODULE" && i.module?.title}
                    {i.type === "WORKSHOP" && i.workshop?.title}
                  </td>
                  <td className="p-3 border-l text-center">
                    <Link
                      href={"/admin/courses/${course.slug}/${item.slug}"}
                      className="text-blue-600 hover:underline"
                    >
                      View more
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
