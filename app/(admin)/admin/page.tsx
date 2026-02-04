import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Dashboard | EduTIA",
    description: "Administrative overview and platform statistics.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminDashboardPage() {
  const [users, courses, enrollments] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <StatCard title="Users" value={users} />
        <StatCard title="Courses" value={courses} />
        <StatCard title="Enrollments" value={enrollments} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
