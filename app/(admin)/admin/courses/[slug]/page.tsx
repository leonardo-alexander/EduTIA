import { prisma } from "@/lib/prisma";

export default async function AdminCourseDetail({
  params,
}: {
  params: { slug: string };
}) {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      modules: true,
      workshops: true,
      enrollments: true,
    },
  });

  if (!course) return <p>Course not found</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>

      <div className="space-y-2">
        <p>
          <b>Category:</b> {course.category.name}
        </p>
        <p>
          <b>Level:</b> {course.level}
        </p>
        <p>
          <b>Published:</b> {course.isPublished ? "Yes" : "No"}
        </p>
        <p>
          <b>Enrollments:</b> {course.enrollments.length}
        </p>
      </div>

      <h2 className="mt-6 font-semibold">Modules</h2>
      <ul className="list-disc ml-5">
        {course.modules.map((m) => (
          <li key={m.id}>{m.title}</li>
        ))}
      </ul>
    </div>
  );
}
